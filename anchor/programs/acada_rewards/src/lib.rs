use anchor_lang::prelude::*;
use anchor_lang::solana_program::ed25519_program;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::sysvar::instructions::{
    load_instruction_at_checked, ID as IX_ID,
};
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount, TransferChecked};

declare_id!("Bge9kSTAw3n4G7nh6Pg1SY3STK8SaoA8PnVqY3HoSB3i");

const REWARD_MESSAGE_PREFIX: &[u8] = b"ACADA_REWARD_V1";

#[program]
pub mod acada_rewards {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        backend_pubkey: Pubkey,
        treasury_authority: Pubkey,
        usdc_mint: Pubkey,
        course_price: u64,
        discount_per_token: u64,
    ) -> Result<()> {
        require!(course_price > 0, ErrorCode::InvalidCoursePrice);

        let config = &mut ctx.accounts.config;
        config.backend_pubkey = backend_pubkey;
        config.mint = ctx.accounts.mint.key();
        config.usdc_mint = usdc_mint;
        config.treasury_authority = treasury_authority;
        config.course_price = course_price;
        config.discount_per_token = discount_per_token;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    pub fn reward_student(
        ctx: Context<RewardStudent>,
        milestone_id: u64,
        amount: u64,
        claim_id: u64,
        expires_at: i64,
        ed25519_instruction_index: u16,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        require!(expires_at >= now, ErrorCode::ClaimExpired);

        let ix = load_instruction_at_checked(
            usize::from(ed25519_instruction_index),
            &ctx.accounts.ix_sysvar,
        )?;
        let expected_message = build_reward_message(
            &ctx.accounts.student.key(),
            milestone_id,
            amount,
            claim_id,
            expires_at,
            &ctx.program_id,
        );

        verify_ed25519_ix(
            &ix,
            &ctx.accounts.config.backend_pubkey.to_bytes(),
            &expected_message,
        )?;

        let claim_record = &mut ctx.accounts.claim_record;
        claim_record.student = ctx.accounts.student.key();
        claim_record.milestone_id = milestone_id;
        claim_record.claim_id = claim_id;
        claim_record.amount = amount;
        claim_record.expires_at = expires_at;
        claim_record.used = true;

        let seeds = &[b"config".as_ref(), &[ctx.accounts.config.bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.student_token_account.to_account_info(),
            authority: ctx.accounts.config.to_account_info(),
        };
        let cpi_ctx =
            CpiContext::new_with_signer(ctx.accounts.token_program.to_account_info(), cpi_accounts, signer);
        token::mint_to(cpi_ctx, amount)?;

        emit!(TokenRewarded {
            student: ctx.accounts.student.key(),
            milestone_id,
            claim_id,
            amount,
            expires_at,
        });

        Ok(())
    }

    pub fn redeem_tokens(ctx: Context<RedeemTokens>, amount: u64) -> Result<()> {
        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.student_token_account.to_account_info(),
            authority: ctx.accounts.student.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        emit!(TokenRedeemed {
            student: ctx.accounts.student.key(),
            amount,
        });

        Ok(())
    }

    pub fn purchase_course(
        ctx: Context<PurchaseCourse>,
        course_id: u64,
        reward_tokens_to_burn: u64,
    ) -> Result<()> {
        require_keys_eq!(
            ctx.accounts.usdc_mint.key(),
            ctx.accounts.config.usdc_mint,
            ErrorCode::InvalidUsdcMint
        );
        require_keys_eq!(
            ctx.accounts.treasury_owner.key(),
            ctx.accounts.config.treasury_authority,
            ErrorCode::InvalidTreasuryAuthority
        );

        let course_price = ctx.accounts.config.course_price;
        let requested_discount = reward_tokens_to_burn
            .checked_mul(ctx.accounts.config.discount_per_token)
            .ok_or(ErrorCode::MathOverflow)?;
        let discount_applied = requested_discount.min(course_price);
        let amount_due = course_price
            .checked_sub(discount_applied)
            .ok_or(ErrorCode::MathOverflow)?;

        if reward_tokens_to_burn > 0 {
            let burn_accounts = Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.student_reward_account.to_account_info(),
                authority: ctx.accounts.student.to_account_info(),
            };
            let burn_ctx =
                CpiContext::new(ctx.accounts.token_program.to_account_info(), burn_accounts);
            token::burn(burn_ctx, reward_tokens_to_burn)?;
        }

        let transfer_accounts = TransferChecked {
            from: ctx.accounts.student_usdc_account.to_account_info(),
            mint: ctx.accounts.usdc_mint.to_account_info(),
            to: ctx.accounts.treasury_usdc_account.to_account_info(),
            authority: ctx.accounts.student.to_account_info(),
        };
        let transfer_ctx =
            CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_accounts);
        token::transfer_checked(transfer_ctx, amount_due, ctx.accounts.usdc_mint.decimals)?;

        emit!(CoursePurchased {
            student: ctx.accounts.student.key(),
            course_id,
            reward_tokens_burned: reward_tokens_to_burn,
            full_price: course_price,
            discount_applied,
            amount_paid: amount_due,
        });

        Ok(())
    }
}

fn build_reward_message(
    student: &Pubkey,
    milestone_id: u64,
    amount: u64,
    claim_id: u64,
    expires_at: i64,
    program_id: &Pubkey,
) -> Vec<u8> {
    let mut message = Vec::new();
    message.extend_from_slice(REWARD_MESSAGE_PREFIX);
    message.extend_from_slice(&student.to_bytes());
    message.extend_from_slice(&milestone_id.to_le_bytes());
    message.extend_from_slice(&amount.to_le_bytes());
    message.extend_from_slice(&claim_id.to_le_bytes());
    message.extend_from_slice(&expires_at.to_le_bytes());
    message.extend_from_slice(&program_id.to_bytes());
    message
}

fn verify_ed25519_ix(
    ix: &Instruction,
    expected_pubkey: &[u8],
    expected_msg: &[u8],
) -> Result<()> {
    require_keys_eq!(ix.program_id, ed25519_program::ID, ErrorCode::InvalidInstruction);

    let data = &ix.data;
    require!(data.len() > 16, ErrorCode::InvalidInstructionData);
    require!(data[0] == 1, ErrorCode::InvalidInstructionData);

    let pubkey_offset = u16::from_le_bytes(data[6..8].try_into().unwrap()) as usize;
    let msg_offset = u16::from_le_bytes(data[10..12].try_into().unwrap()) as usize;
    let msg_size = u16::from_le_bytes(data[12..14].try_into().unwrap()) as usize;

    require!(data.len() >= pubkey_offset + 32, ErrorCode::InvalidInstructionData);
    require!(data.len() >= msg_offset + msg_size, ErrorCode::InvalidInstructionData);

    let ix_pubkey = &data[pubkey_offset..pubkey_offset + 32];
    let ix_msg = &data[msg_offset..msg_offset + msg_size];

    require!(ix_pubkey == expected_pubkey, ErrorCode::UnauthorizedSigner);
    require!(ix_msg == expected_msg, ErrorCode::InvalidMessage);

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Config::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 2,
        mint::authority = config,
        seeds = [b"acada_mint"],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(milestone_id: u64, amount: u64, claim_id: u64, expires_at: i64, ed25519_instruction_index: u16)]
pub struct RewardStudent<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,

    #[account(mut, seeds = [b"acada_mint"], bump)]
    pub mint: Account<'info, Mint>,

    /// CHECK: Instructions sysvar account used for Ed25519 validation
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + ClaimRecord::INIT_SPACE,
        seeds = [
            b"claim",
            student.key().as_ref(),
            milestone_id.to_le_bytes().as_ref(),
            claim_id.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub claim_record: Account<'info, ClaimRecord>,

    /// CHECK: A relayer may submit on behalf of the student.
    pub student: AccountInfo<'info>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = student
    )]
    pub student_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RedeemTokens<'info> {
    #[account(mut, seeds = [b"acada_mint"], bump)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub student: Signer<'info>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = student
    )]
    pub student_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PurchaseCourse<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,

    #[account(mut, seeds = [b"acada_mint"], bump)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub usdc_mint: Account<'info, Mint>,

    #[account(mut)]
    pub student: Signer<'info>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = student
    )]
    pub student_reward_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = student
    )]
    pub student_usdc_account: Account<'info, TokenAccount>,

    /// CHECK: Validated against config.treasury_authority
    pub treasury_owner: AccountInfo<'info>,

    #[account(
        mut,
        token::mint = usdc_mint,
        token::authority = treasury_owner
    )]
    pub treasury_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub backend_pubkey: Pubkey,
    pub mint: Pubkey,
    pub usdc_mint: Pubkey,
    pub treasury_authority: Pubkey,
    pub course_price: u64,
    pub discount_per_token: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ClaimRecord {
    pub student: Pubkey,
    pub milestone_id: u64,
    pub claim_id: u64,
    pub amount: u64,
    pub expires_at: i64,
    pub used: bool,
}

#[event]
pub struct TokenRewarded {
    pub student: Pubkey,
    pub milestone_id: u64,
    pub claim_id: u64,
    pub amount: u64,
    pub expires_at: i64,
}

#[event]
pub struct TokenRedeemed {
    pub student: Pubkey,
    pub amount: u64,
}

#[event]
pub struct CoursePurchased {
    pub student: Pubkey,
    pub course_id: u64,
    pub reward_tokens_burned: u64,
    pub full_price: u64,
    pub discount_applied: u64,
    pub amount_paid: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Instruction mismatch or invalid program.")]
    InvalidInstruction,
    #[msg("Instruction data formatting is invalid.")]
    InvalidInstructionData,
    #[msg("The provided signature was not signed by the authorized backend key.")]
    UnauthorizedSigner,
    #[msg("The data payload of the signature does not match the expected constraints.")]
    InvalidMessage,
    #[msg("This reward claim has expired.")]
    ClaimExpired,
    #[msg("The configured course price must be greater than zero.")]
    InvalidCoursePrice,
    #[msg("The provided USDC mint does not match config.")]
    InvalidUsdcMint,
    #[msg("The provided treasury authority does not match config.")]
    InvalidTreasuryAuthority,
    #[msg("Arithmetic overflow occurred.")]
    MathOverflow,
}
