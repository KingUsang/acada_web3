"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/context";
import { useOrganizations } from "../../lib/api";
import { toast } from "sonner";

export default function CreateCoursePage() {
  const { idToken } = useAuth();
  const { data: orgsData, isLoading: orgsLoading } = useOrganizations();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organization_id: "",
    price_usdc: 0,
    category: "TUTORIAL",
    duration: "",
    thumbnail_url: "",
  });

  const organizations = orgsData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price_usdc" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization_id) {
      toast.error("Please select an organization");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create course");
      }

      toast.success("Course created successfully!");
      router.push("/tutor_home");
    } catch (error: any) {
      console.error("Create course error:", error);
      toast.error(error.message || "An error occurred while creating the course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen font-body text-on-background">
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 glass-header shadow-[0_16px_32px_-4px_rgba(7,14,29,0.04)]">
        <Link href="/tutor_home">
          <span className="text-2xl font-black tracking-tighter text-blue-600">Create Course</span>
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <section className="mb-12">
          <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-inverse-surface mb-4">
            Create a New Course
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Fill in the details below to publish your course to the Acada marketplace.
          </p>
        </section>

        <section className="bg-surface-container-lowest rounded-xl p-8 shadow-xl border border-outline-variant">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="organization_id">
                Organization
              </label>
              <select
                id="organization_id"
                name="organization_id"
                required
                className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                value={formData.organization_id}
                onChange={handleChange}
                disabled={orgsLoading}
              >
                <option value="">Select an organization</option>
                {organizations.map((org: any) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {organizations.length === 0 && !orgsLoading && (
                <p className="text-xs text-destructive mt-1">You must be an admin of an organization to create courses.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="title">
                Course Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Advanced Quantum Mechanics"
                required
                className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe what students will learn..."
                rows={4}
                className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="price_usdc">
                  Price (USDC)
                </label>
                <input
                  id="price_usdc"
                  name="price_usdc"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                  value={formData.price_usdc}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="WEB3">Web3</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="duration">
                Duration (e.g. 8 Weeks, 10 Hours)
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                placeholder="e.g. 6 Weeks"
                className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-sm font-bold uppercase tracking-wider text-on-surface-variant" htmlFor="thumbnail_url">
                Thumbnail URL
              </label>
              <input
                id="thumbnail_url"
                name="thumbnail_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full p-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary text-on-surface"
                value={formData.thumbnail_url}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || organizations.length === 0}
              className="w-full py-5 rounded-xl bg-primary text-on-primary font-headline font-extrabold text-lg tracking-tight shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Creating Course..." : "Publish Course"}
            </button>
          </form>
        </section>
      </main>
      <style jsx>{`
        .glass-header {
          background: rgba(249, 249, 255, 0.6);
          backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
