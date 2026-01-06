import { useState } from 'react';
import { X, Calendar, Mail, Phone, Building2, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

interface DemoBookingForm {
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface DemoBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoBookingDialog({ open, onOpenChange }: DemoBookingDialogProps) {
  const [formData, setFormData] = useState<DemoBookingForm>({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', company: '' });
      setSubmitSuccess(false);
      onOpenChange(false);
    }, 2000);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fadeInUp"
        style={{ animationDelay: '0ms' }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-md pointer-events-auto animate-scaleIn bg-card text-card-foreground" style={{ animationDelay: '100ms' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/40 to-primary/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">预约演示</h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 bg-background/50">
            {submitSuccess ? (
              <div className="text-center space-y-4 animate-fadeInUp">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">预约成功！</h3>
                <p className="text-sm text-muted-foreground">
                  我们已收到您的预约申请，销售团队将在 2 小时内与您联系。
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4 text-primary" />
                    姓名 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入您的姓名"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="请输入您的邮箱"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    电话 *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="请输入您的电话"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* Company */}
                <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '250ms' }}>
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    公司名称
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="请输入您的公司名称"
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground mt-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                  我们将在收到您的信息后，及时安排演示。感谢您的关注！
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 animate-fadeInUp" style={{ animationDelay: '350ms' }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 transition-all"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full" />
                        提交中...
                      </span>
                    ) : (
                      '提交'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}