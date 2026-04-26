"use client";

/**
 * Farmer Registration Page — Fresh Direct
 *
 * Multi-step form (3 steps):
 *  Step 1 — Account Details   (name, email, password, NIC, mobile)
 *  Step 2 — Farm Profile      (farmName, location, cropTypes, bio)
 *  Step 3 — Bank Details      (accountName, bank, branch, accountNumber)
 *
 * Validation: zod + react-hook-form (@hookform/resolvers/zod)
 * Style: mirrors Login page language — same card, same brand panel, same tokens
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  CreditCard,
  MapPin,
  Leaf,
  Sprout,
  Landmark,
  Building2,
  Hash,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Crop Options (mirrors CROP_TYPES from dashboardData) ─────────────────────
const CROP_OPTIONS = [
  "Baby Spinach", "Leeks", "Murunga / Drumstick", "King Coconut",
  "Ginger", "Bitter Gourd", "Carrot", "Tomato", "Green Chilli",
  "Gotukola", "Pumpkin", "Beans", "Capsicum", "Broccoli",
  "Beetroot", "Radish", "Sweet Potato", "Banana",
];

const SRI_LANKA_BANKS = [
  "Bank of Ceylon", "People's Bank", "Commercial Bank", "Hatton National Bank",
  "Sampath Bank", "Seylan Bank", "Nations Trust Bank", "DFCC Bank",
  "Pan Asia Banking Corporation", "Union Bank", "Amana Bank", "MCB Bank",
];

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const step1Schema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Name too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
    nic: z
      .string()
      .min(9, "NIC must be at least 9 characters")
      .max(12, "NIC too long")
      .regex(/^(\d{9}[vVxX]|\d{12})$/, "Invalid NIC format (e.g. 901234567V or 199012345678)"),
    mobile: z
      .string()
      .regex(/^0[0-9]{9}$/, "Invalid mobile number (e.g. 0771234567)"),
    whatsapp: z.boolean().default(false),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  farmName: z
    .string()
    .min(3, "Farm name must be at least 3 characters")
    .max(150, "Farm name too long"),
  location: z
    .string()
    .min(5, "Please enter your full farm address / district")
    .max(300, "Address too long"),
  cropTypes: z
    .array(z.string())
    .min(1, "Select at least one crop type"),
  bio: z
    .string()
    .max(1000, "Bio must be under 1000 characters")
    .optional(),
});

const step3Schema = z.object({
  accountName: z.string().min(3, "Account name is required"),
  bankName: z.string().min(1, "Please select your bank"),
  branchName: z.string().min(2, "Branch name is required"),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
});

type Step1Input = z.input<typeof step1Schema>;
type Step1Data = z.output<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { label: "Account",   icon: User       },
  { label: "Farm",      icon: Sprout     },
  { label: "Payment",   icon: CreditCard },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const Icon    = step.icon;
        const done    = i < currentStep;
        const active  = i === currentStep;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold text-sm",
                  done   && "bg-[#3E7B27] text-white shadow-[0_4px_16px_rgba(62,123,39,0.35)]",
                  active && "bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white shadow-[0_4px_16px_rgba(26,48,32,0.4)]",
                  !done && !active && "bg-[#F0F7F0] text-[#6B8F6E] border-2 border-[#C8DFC8]",
                )}
              >
                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold transition-colors",
                  active ? "text-[#1A3020]" : done ? "text-[#3E7B27]" : "text-[#6B8F6E]",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-10 h-0.5 mx-1 mb-4 transition-all duration-500",
                  done ? "bg-[#3E7B27]" : "bg-[#C8DFC8]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input Component (mirrors login page style) ───────────────────────────────
interface InputProps {
  id: string;
  label: string;
  error?: string;
  icon: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ id, label, error, icon, required, children }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.82rem] font-semibold text-[#1B4332] block mb-1.5">
        {label}
        {required && <span className="text-[#3E7B27] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8F6E] pointer-events-none z-10">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[0.75rem] text-red-600 mt-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full pl-10 pr-4 py-3.5 border-[1.5px] rounded-2xl text-[0.9rem] text-[#1A3020]",
    "bg-white outline-none transition-all duration-200 min-h-[48px]",
    "placeholder:text-[#8FAF9A] focus:shadow-[0_0_0_3px_rgba(62,123,39,0.12)]",
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-[#C8DFC8] focus:border-[#3E7B27]",
  );

// ─── Step 1: Account Details ──────────────────────────────────────────────────
function Step1({
  onNext,
}: {
  onNext: SubmitHandler<Step1Data>;
}) {
  const [showPw, setShowPw]     = useState(false);
  const [showCPw, setShowCPw]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step1Input, unknown, Step1Data>({ resolver: zodResolver(step1Schema) });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      {/* Full Name */}
      <FormField id="fullName" label="Full Name" icon={<User className="w-4 h-4" />} required error={errors.fullName?.message}>
        <input
          {...register("fullName")}
          id="fullName"
          type="text"
          placeholder="Nimal Perera"
          autoComplete="name"
          className={inputCls(!!errors.fullName)}
        />
      </FormField>

      {/* Email */}
      <FormField id="email" label="Email Address" icon={<Mail className="w-4 h-4" />} required error={errors.email?.message}>
        <input
          {...register("email")}
          id="email"
          type="email"
          placeholder="nimal@example.com"
          autoComplete="email"
          className={inputCls(!!errors.email)}
        />
      </FormField>

      {/* NIC */}
      <FormField id="nic" label="NIC Number" icon={<CreditCard className="w-4 h-4" />} required error={errors.nic?.message}>
        <input
          {...register("nic")}
          id="nic"
          type="text"
          placeholder="901234567V or 199012345678"
          className={inputCls(!!errors.nic)}
        />
      </FormField>

      {/* Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-start">
        <FormField id="mobile" label="Mobile Number" icon={<Phone className="w-4 h-4" />} required error={errors.mobile?.message}>
          <input
            {...register("mobile")}
            id="mobile"
            type="tel"
            placeholder="0771234567"
            autoComplete="tel"
            className={inputCls(!!errors.mobile)}
          />
        </FormField>
        <div className="sm:pt-7 flex items-center gap-2 min-h-[48px]">
          <input
            {...register("whatsapp")}
            id="whatsapp"
            type="checkbox"
            className="w-4 h-4 accent-[#3E7B27] cursor-pointer"
          />
          <label htmlFor="whatsapp" className="text-[0.82rem] text-[#3D5C42] font-medium cursor-pointer whitespace-nowrap">
            WhatsApp enabled
          </label>
        </div>
      </div>

      {/* Password */}
      <FormField id="password" label="Password" icon={<Lock className="w-4 h-4" />} required error={errors.password?.message}>
        <input
          {...register("password")}
          id="password"
          type={showPw ? "text" : "password"}
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          className={cn(inputCls(!!errors.password), "pr-11")}
        />
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8FAF9A] hover:text-[#3D5C42] transition-colors"
        >
          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </FormField>

      {/* Confirm Password */}
      <FormField id="confirmPassword" label="Confirm Password" icon={<Lock className="w-4 h-4" />} required error={errors.confirmPassword?.message}>
        <input
          {...register("confirmPassword")}
          id="confirmPassword"
          type={showCPw ? "text" : "password"}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          className={cn(inputCls(!!errors.confirmPassword), "pr-11")}
        />
        <button
          type="button"
          onClick={() => setShowCPw(!showCPw)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8FAF9A] hover:text-[#3D5C42] transition-colors"
        >
          {showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </FormField>

      {/* Strength hint */}
      {watch("password") && (
        <div className="flex gap-1 mt-[-8px]">
          {[8, 12, 20].map((len, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                (watch("password") || "").length >= len ? "bg-[#3E7B27]" : "bg-[#C8DFC8]",
              )}
            />
          ))}
        </div>
      )}

      <NextButton label="Continue to Farm Profile" />
    </form>
  );
}

// ─── Step 2: Farm Profile ─────────────────────────────────────────────────────
function Step2({
  onNext,
  onBack,
}: {
  onNext: SubmitHandler<Step2Data>;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: { cropTypes: [] } });

  const selected = watch("cropTypes") ?? [];

  const toggleCrop = (crop: string) => {
    const next = selected.includes(crop)
      ? selected.filter((c) => c !== crop)
      : [...selected, crop];
    setValue("cropTypes", next, { shouldValidate: true });
  };

  const bioValue = watch("bio") ?? "";

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      {/* Farm Name */}
      <FormField id="farmName" label="Farm Name" icon={<Sprout className="w-4 h-4" />} required error={errors.farmName?.message}>
        <input
          {...register("farmName")}
          id="farmName"
          type="text"
          placeholder="e.g. Green Hills Farm"
          className={inputCls(!!errors.farmName)}
        />
      </FormField>

      {/* Location */}
      <FormField id="location" label="Farm Address / District" icon={<MapPin className="w-4 h-4" />} required error={errors.location?.message}>
        <input
          {...register("location")}
          id="location"
          type="text"
          placeholder="e.g. Nuwara Eliya, Central Province"
          className={inputCls(!!errors.location)}
        />
      </FormField>

      {/* Crop Types — multiselect chips */}
      <div>
        <p className="text-[0.82rem] font-semibold text-[#1B4332] mb-1.5">
          Primary Crop Types <span className="text-[#3E7B27]">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {CROP_OPTIONS.map((crop) => {
            const active = selected.includes(crop);
            return (
              <button
                key={crop}
                type="button"
                onClick={() => toggleCrop(crop)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[0.78rem] font-semibold border-[1.5px] transition-all duration-200",
                  "min-h-[36px] cursor-pointer",
                  active
                    ? "bg-[#1A3020] text-white border-[#1A3020] shadow-[0_2px_8px_rgba(26,48,32,0.25)]"
                    : "bg-white text-[#3D5C42] border-[#C8DFC8] hover:border-[#3E7B27] hover:bg-[#F0F7F0]",
                )}
              >
                {active ? "✓ " : ""}{crop}
              </button>
            );
          })}
        </div>
        {errors.cropTypes && (
          <p className="flex items-center gap-1 text-[0.75rem] text-red-600 mt-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.cropTypes.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="text-[0.82rem] font-semibold text-[#1B4332] block mb-1.5">
          About Your Farm
          <span className="text-[#6B8F6E] font-normal ml-1">(Optional)</span>
        </label>
        <textarea
          {...register("bio")}
          id="bio"
          rows={3}
          placeholder="Tell buyers about your farm, your growing practices, and what makes your produce special..."
          className={cn(
            "w-full px-4 py-3.5 border-[1.5px] rounded-2xl text-[0.9rem] text-[#1A3020]",
            "bg-white outline-none transition-all duration-200 resize-none",
            "placeholder:text-[#8FAF9A] focus:border-[#3E7B27] focus:shadow-[0_0_0_3px_rgba(62,123,39,0.12)]",
            errors.bio ? "border-red-400" : "border-[#C8DFC8]",
          )}
        />
        <p className="text-right text-[0.72rem] text-[#8FAF9A] mt-1">
          {bioValue.length}/1000
        </p>
        {errors.bio && (
          <p className="flex items-center gap-1 text-[0.75rem] text-red-600 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.bio.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <BackButton onClick={onBack} />
        <NextButton label="Continue to Bank Details" />
      </div>
    </form>
  );
}

// ─── Step 3: Bank Details ─────────────────────────────────────────────────────
function Step3({
  onSubmit: onFormSubmit,
  onBack,
  isLoading,
}: {
  onSubmit: SubmitHandler<Step3Data>;
  onBack: () => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
      {/* Trust banner */}
      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#F0F7F0] to-[#E8F5E9] rounded-2xl border border-[#C8DFC8]">
        <div className="w-8 h-8 rounded-xl bg-[rgba(242,180,65,0.15)] flex items-center justify-center flex-shrink-0">
          <Landmark className="w-4 h-4 text-[#F2B441]" />
        </div>
        <div>
          <p className="text-[0.82rem] font-bold text-[#1A3020] mb-0.5">Secure Payments</p>
          <p className="text-[0.75rem] text-[#3D5C42] leading-relaxed">
            Your bank details are encrypted and used only for payouts. Fresh Direct pays every Thursday.
          </p>
        </div>
      </div>

      {/* Account Name */}
      <FormField id="accountName" label="Account Holder Name" icon={<User className="w-4 h-4" />} required error={errors.accountName?.message}>
        <input
          {...register("accountName")}
          id="accountName"
          type="text"
          placeholder="Exactly as shown on passbook"
          className={inputCls(!!errors.accountName)}
        />
      </FormField>

      {/* Bank */}
      <div>
        <label htmlFor="bankName" className="text-[0.82rem] font-semibold text-[#1B4332] block mb-1.5">
          Bank <span className="text-[#3E7B27]">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8F6E] pointer-events-none z-10">
            <Building2 className="w-4 h-4" />
          </span>
          <select
            {...register("bankName")}
            id="bankName"
            className={cn(inputCls(!!errors.bankName), "appearance-none cursor-pointer")}
          >
            <option value="">Select your bank...</option>
            {SRI_LANKA_BANKS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        {errors.bankName && (
          <p className="flex items-center gap-1 text-[0.75rem] text-red-600 mt-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.bankName.message}
          </p>
        )}
      </div>

      {/* Branch + Account Number (2-col on larger screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField id="branchName" label="Branch" icon={<MapPin className="w-4 h-4" />} required error={errors.branchName?.message}>
          <input
            {...register("branchName")}
            id="branchName"
            type="text"
            placeholder="e.g. Nuwara Eliya"
            className={inputCls(!!errors.branchName)}
          />
        </FormField>

        <FormField id="accountNumber" label="Account Number" icon={<Hash className="w-4 h-4" />} required error={errors.accountNumber?.message}>
          <input
            {...register("accountNumber")}
            id="accountNumber"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 8001234567"
            className={inputCls(!!errors.accountNumber)}
          />
        </FormField>
      </div>

      <div className="flex gap-3">
        <BackButton onClick={onBack} />

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex-1 py-3.5 text-white rounded-2xl font-bold text-[0.95rem]",
            "transition-all duration-200 flex items-center justify-center gap-2",
            "min-h-[48px] shadow-[0_6px_24px_rgba(26,48,32,0.3)]",
            isLoading
              ? "bg-[#3E7B27] cursor-not-allowed"
              : "bg-gradient-to-br from-[#1A3020] to-[#3E7B27] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(26,48,32,0.4)]",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Creating your account…
            </>
          ) : (
            <>
              <Leaf className="w-4 h-4" />
              Join Fresh Direct 🌿
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Shared Navigation Buttons ────────────────────────────────────────────────
function NextButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className={cn(
        "w-full py-3.5 text-white rounded-2xl font-bold text-[0.95rem]",
        "transition-all duration-200 flex items-center justify-center gap-2",
        "min-h-[48px] shadow-[0_6px_24px_rgba(26,48,32,0.3)]",
        "bg-gradient-to-br from-[#1A3020] to-[#3E7B27] cursor-pointer",
        "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(26,48,32,0.4)]",
      )}
    >
      {label}
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-5 py-3.5 text-[#3D5C42] rounded-2xl font-bold text-[0.9rem]",
        "border-[1.5px] border-[#C8DFC8] bg-white transition-all duration-200",
        "flex items-center gap-1.5 min-h-[48px] hover:border-[#3E7B27] hover:text-[#1A3020]",
      )}
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen() {
  return (
    <div className="text-center py-4">
      <div className="w-20 h-20 bg-gradient-to-br from-[#3E7B27] to-[#2C6020] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgba(62,123,39,0.35)]">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-[1.6rem] font-extrabold text-[#1A3020] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        Application Submitted!
      </h2>
      <p className="text-[0.9rem] text-[#3D5C42] leading-relaxed mb-6">
        Welcome to Fresh Direct. Our team will verify your farm profile within{" "}
        <span className="font-bold text-[#1A3020]">24–48 hours</span>. You'll
        receive an email once your account is approved.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/FamerDashbord"
          className={cn(
            "w-full py-3.5 bg-gradient-to-br from-[#1A3020] to-[#3E7B27] text-white",
            "rounded-2xl font-bold text-[0.95rem] flex items-center justify-center gap-2",
            "shadow-[0_6px_24px_rgba(26,48,32,0.3)] hover:-translate-y-0.5 transition-all duration-200",
            "hover:shadow-[0_10px_30px_rgba(26,48,32,0.4)]",
          )}
        >
          <Leaf className="w-4 h-4" />
          Go to My Dashboard
        </Link>
        <Link
          href="/"
          className="text-[0.85rem] text-[#4A6355] hover:text-[#1B4332] font-medium transition-colors"
        >
          ← Back to FreshDirect home
        </Link>
      </div>
    </div>
  );
}

// ─── Root Page Component ──────────────────────────────────────────────────────
export default function FarmerRegisterPage() {
  const router    = useRouter();
  const [step, setStep]         = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]   = useState("");
  const [success, setSuccess]     = useState(false);

  // Accumulate data across steps
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);

  const handleStep1: SubmitHandler<Step1Data> = (data) => {
    setStep1Data(data);
    setStep(1);
  };

  const handleStep2: SubmitHandler<Step2Data> = (data) => {
    setStep2Data(data);
    setStep(2);
  };

  const handleStep3: SubmitHandler<Step3Data> = async (data) => {
    if (!step1Data || !step2Data) return;
    setIsLoading(true);
    setApiError("");

    try {
      const payload = {
        // User fields
        name:            step1Data.fullName,
        email:           step1Data.email,
        password:        step1Data.password,
        nic:             step1Data.nic,
        mobile:          step1Data.mobile,
        whatsappEnabled: step1Data.whatsapp,
        // FarmerProfile fields
        farmName:        step2Data.farmName,
        location:        step2Data.location,
        cropTypes:       step2Data.cropTypes,
        bio:             step2Data.bio ?? "",
        // Bank details
        bankDetails: {
          accountName:   data.accountName,
          bank:          data.bankName,
          branch:        data.branchName,
          accountNumber: data.accountNumber,
        },
        role: "FARMER",
      };

      const res = await fetch("/api/register/farmer", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Registration failed. Please try again.");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#F0FBF1] via-[#D8F3DC] to-[#B7E4C7] relative overflow-hidden">

      {/* ── Decorative blobs ─────────────────────────────────────────────── */}
      <div className="absolute -top-[120px] -right-[120px] w-[500px] h-[500px] rounded-full bg-[rgba(45,106,79,0.07)] pointer-events-none" />
      <div className="absolute -bottom-[80px] -left-[80px] w-[350px] h-[350px] rounded-full bg-[rgba(255,183,3,0.08)] pointer-events-none" />

      {/* Floating leaves */}
      {["🌿", "🍃", "🌱", "🍂"].map((leaf, i) => (
        <span
          key={i}
          className="absolute select-none pointer-events-none animate-float-leaf"
          style={{
            fontSize: `${1.2 + i * 0.4}rem`,
            opacity: 0.18,
            top: `${10 + i * 20}%`,
            left: `${3 + i * 3}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {leaf}
        </span>
      ))}

      {/* ── Left Brand Panel (desktop) ───────────────────────────────────── */}
      <div
        id="brand-panel"
        className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#52B788] relative overflow-hidden"
      >
        <div className="absolute -top-[60px] -right-[60px] w-[280px] h-[280px] rounded-full bg-[rgba(255,183,3,0.12)] pointer-events-none" />
        <div className="absolute bottom-[5%] -left-[40px] w-[200px] h-[200px] rounded-full bg-[rgba(255,255,255,0.05)] pointer-events-none" />

        {/* Logo */}
        <div className="text-center mb-10 relative z-[1]">
          <div className="w-[72px] h-[72px] bg-white/15 rounded-[20px] flex items-center justify-center text-[2.2rem] mx-auto mb-4 border border-white/20">🌿</div>
          <h1
            className="text-[2.2rem] font-extrabold text-white m-0 mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Fresh<span className="text-[#FFB703]">Direct</span>
          </h1>
          <p className="text-white/70 text-[0.9rem] m-0">Farmer Partner Programme</p>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-5 relative z-[1] max-w-[320px] w-full">
          {[
            { icon: "💰", title: "Weekly Payouts",          desc: "Get paid every Thursday directly to your bank account" },
            { icon: "📱", title: "WhatsApp Order Alerts",   desc: "Instant notifications the moment a buyer places an order" },
            { icon: "📊", title: "Your Own Dashboard",      desc: "Track earnings, manage stock, and view buyer profiles" },
            { icon: "✅", title: "Verified Farmer Badge",   desc: "Build buyer trust with our verification programme" },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl bg-white/12 flex items-center justify-center text-[1.3rem] flex-shrink-0 border border-white/15">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-bold text-[0.95rem] m-0 mb-px">{item.title}</p>
                <p className="text-white/60 text-[0.82rem] m-0 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Farmer testimonial */}
        
      </div>

      {/* ── Right Panel — Form ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 py-4 overflow-y-auto min-h-0">

        {/* Mobile Logo */}
        <div className="mb-6 text-center lg:hidden">
          <div className="inline-flex items-center gap-2.5 bg-white px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(45,106,79,0.12)] border border-[#D0EDD8]">
            <span className="text-[1.4rem]">🌿</span>
            <span
              className="text-[1.3rem] font-extrabold text-[#2D6A4F]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Fresh<span className="text-[#FFB703]">Direct</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-[480px] max-h-[88vh] overflow-y-auto bg-white/92 backdrop-blur-[20px] rounded-[28px] px-8 py-7 shadow-[0_20px_60px_rgba(45,106,79,0.15),0_4px_20px_rgba(45,106,79,0.08)] border border-[rgba(208,237,216,0.6)]">

          {/* Card header */}
          {!success && (
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1A3020] to-[#3E7B27] rounded-2xl flex items-center justify-center text-[1.6rem] mx-auto mb-4 shadow-[0_8px_24px_rgba(26,48,32,0.3)]">
                🌾
              </div>
              <h2
                className="text-[1.6rem] font-extrabold text-[#1B4332] m-0 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Join as a Farmer
              </h2>
              <p className="text-[#4A6355] text-[0.88rem] m-0">
                Step {step + 1} of 3 — {["Account Details", "Farm Profile", "Bank Details"][step]}
              </p>
            </div>
          )}

          {/* Step indicator */}
          {!success && <StepIndicator currentStep={step} />}

          {/* API Error */}
          {apiError && (
            <div className="bg-[#FFF5F5] border border-[#FFD0D0] rounded-xl p-3.5 mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-[#C53030] text-[0.85rem] m-0">{apiError}</p>
            </div>
          )}

          {/* Steps */}
          {success ? (
            <SuccessScreen />
          ) : step === 0 ? (
            <Step1 onNext={handleStep1} />
          ) : step === 1 ? (
            <Step2 onNext={handleStep2} onBack={() => setStep(0)} />
          ) : (
            <Step3 onSubmit={handleStep3} onBack={() => setStep(1)} isLoading={isLoading} />
          )}

          {/* Footer */}
          {!success && (
            <p className="text-center text-[0.82rem] text-[#4A6355] mt-6">
              Already have an account?{" "}
              <Link href="/login" id="goto-login" className="text-[#2D6A4F] font-bold no-underline hover:text-[#1B4332]">
                Sign In →
              </Link>
            </p>
          )}
          {/* Terms — inside card so they scroll with it */}
          {!success && (
            <p className="mt-5 text-[0.72rem] text-[#8FAF9A] text-center leading-relaxed">
              By registering, you agree to our{" "}
              <Link href="#" className="text-[#2D6A4F] no-underline hover:underline">Terms of Service</Link>{" "}and{" "}
              <Link href="#" className="text-[#2D6A4F] no-underline hover:underline">Privacy Policy</Link>.
              Your information is protected under Sri Lanka&apos;s Data Protection Act.
            </p>
          )}

          <div className="flex justify-center mt-3">
            <Link
              href="/"
              id="back-to-home"
              className="inline-flex items-center gap-1.5 text-[0.82rem] text-[#4A6355] no-underline font-medium hover:text-[#1B4332] transition-colors"
            >
              ← Back to FreshDirect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
