use anchor_lang::prelude::*;

declare_id!("GQMhDEE5rNfbLdHSP9hJzVm9pbQN7o4QkAP6tGrsVXYi");

#[program]
pub mod acada_certificates {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, issuer: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.issuer = issuer;
        config.bump = ctx.bumps.config;
        Ok(())
    }

    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        course_id: Pubkey,
        milestone_id: Pubkey,
        metadata_uri: String,
        score: u16,
    ) -> Result<()> {
        require!(metadata_uri.len() <= 200, CertificateError::MetadataTooLong);
        require!(score <= 1000, CertificateError::InvalidScore);

        let config = &ctx.accounts.config;
        require_keys_eq!(ctx.accounts.issuer.key(), config.issuer, CertificateError::UnauthorizedIssuer);

        let cert = &mut ctx.accounts.certificate;
        cert.student = ctx.accounts.student.key();
        cert.course_id = course_id;
        cert.milestone_id = milestone_id;
        cert.metadata_uri = metadata_uri;
        cert.score = score;
        cert.issued_at = Clock::get()?.unix_timestamp;
        cert.bump = ctx.bumps.certificate;

        emit!(CertificateIssued {
            student: cert.student,
            course_id,
            milestone_id,
            metadata_uri: cert.metadata_uri.clone(),
            score,
            issued_at: cert.issued_at,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + CertificateConfig::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, CertificateConfig>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(course_id: Pubkey, milestone_id: Pubkey, metadata_uri: String, score: u16)]
pub struct IssueCertificate<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, CertificateConfig>,
    #[account(mut)]
    pub issuer: Signer<'info>,
    /// CHECK: student wallet receiving certificate credit
    pub student: UncheckedAccount<'info>,
    #[account(
        init,
        payer = issuer,
        space = 8 + CertificateRecord::INIT_SPACE,
        seeds = [b"certificate", student.key().as_ref(), course_id.as_ref()],
        bump
    )]
    pub certificate: Account<'info, CertificateRecord>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct CertificateConfig {
    pub issuer: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CertificateRecord {
    pub student: Pubkey,
    pub course_id: Pubkey,
    pub milestone_id: Pubkey,
    #[max_len(200)]
    pub metadata_uri: String,
    pub score: u16,
    pub issued_at: i64,
    pub bump: u8,
}

#[event]
pub struct CertificateIssued {
    pub student: Pubkey,
    pub course_id: Pubkey,
    pub milestone_id: Pubkey,
    pub metadata_uri: String,
    pub score: u16,
    pub issued_at: i64,
}

#[error_code]
pub enum CertificateError {
    #[msg("Only configured issuer may mint certificates")]
    UnauthorizedIssuer,
    #[msg("Metadata URI too long")]
    MetadataTooLong,
    #[msg("Invalid score")]
    InvalidScore,
}
