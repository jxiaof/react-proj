import { useState } from 'react';
import { X, Zap, Check, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { cn } from '@/shared/utils/cn';

export interface ModelConfig {
    name: string;
    model: string;
    description: string;
    isDefault: boolean;
}

interface ModelEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: ModelConfig) => void;
    model?: {
        id: string;
        name: string;
        model: string;
        description: string;
        isDefault: boolean;
    } | null;
}

export function ModelEditDialog({ open, onOpenChange, onConfirm, model }: ModelEditDialogProps) {
    const [formData, setFormData] = useState<ModelConfig>({
        name: model?.name || '',
        model: model?.model || '',
        description: model?.description || '',
        isDefault: model?.isDefault || false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.model) {
            alert('请填写必填项');
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        onConfirm(formData);
        setFormData({ name: '', model: '', description: '', isDefault: false });
        setIsSubmitting(false);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/50 animate-fadeInUp"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <Card className="w-full max-w-md pointer-events-auto animate-scaleIn shadow-2xl bg-card text-card-foreground" style={{ animationDelay: '100ms' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border/30">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-foreground">编辑模型</h2>
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
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Model Name */}
                            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                                <label className="text-sm font-medium text-foreground">
                                    模型名称 *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="例如：OpenAI GPT-4o"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            {/* Model ID */}
                            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                                <label className="text-sm font-medium text-foreground">
                                    模型 ID *
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="例如：gpt-4o"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                                <label className="text-sm font-medium text-foreground">
                                    描述
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="输入模型的简要描述"
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                />
                            </div>

                            {/* Set as Default */}
                            <div className="flex items-center gap-3 animate-fadeInUp p-3 rounded-lg bg-muted/30 border border-border/30" style={{ animationDelay: '250ms' }}>
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-input focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                />
                                <label htmlFor="isDefault" className="text-sm font-medium text-foreground cursor-pointer">
                                    设置为默认模型
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    取消
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full" />
                                            保存中...
                                        </span>
                                    ) : (
                                        '保存修改'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </>
    );
}