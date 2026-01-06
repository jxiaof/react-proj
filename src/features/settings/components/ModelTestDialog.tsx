import { useState } from 'react';
import { X, Zap, Send, Loader, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { cn } from '@/shared/utils/cn';

interface ModelTestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    modelName: string;
    modelId: string;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export function ModelTestDialog({ open, onOpenChange, modelName, modelId }: ModelTestDialogProps) {
    const [testInput, setTestInput] = useState('');
    const [testResponse, setTestResponse] = useState('');
    const [testStatus, setTestStatus] = useState<TestStatus>('idle');
    const [testError, setTestError] = useState('');
    const [testHistory, setTestHistory] = useState<Array<{ q: string; a: string; time: string }>>([]);

    const handleTest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testInput.trim()) return;

        setTestStatus('testing');
        setTestError('');
        setTestResponse('');

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 模拟响应
        const mockResponses = [
            '这是来自 ' + modelName + ' 的测试响应。模型连接正常，可以处理您的请求。',
            '模型测试成功！' + modelName + ' 已成功连接并可用。',
            '测试通过。' + modelName + ' 正在正常运行中。',
        ];

        const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        setTestResponse(response);
        setTestStatus('success');

        // 添加到历史记录
        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN');
        setTestHistory(prev => [{ q: testInput, a: response, time: timeStr }, ...prev.slice(0, 4)]);

        // 清空输入
        setTestInput('');
    };

    const handleReset = () => {
        setTestInput('');
        setTestResponse('');
        setTestStatus('idle');
        setTestError('');
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
                <Card className="w-full max-w-2xl pointer-events-auto animate-scaleIn shadow-2xl bg-card text-card-foreground max-h-[80vh] flex flex-col" style={{ animationDelay: '100ms' }}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border/30 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">测试模型</h2>
                                <p className="text-xs text-muted-foreground mt-1">{modelName} ({modelId})</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50">
                        {/* Test Input */}
                        <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                            <label className="text-sm font-medium text-foreground">
                                输入测试问题
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleTest(e as any)}
                                    placeholder="输入问题来测试模型..."
                                    disabled={testStatus === 'testing'}
                                    className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                                />
                                <Button
                                    onClick={handleTest as any}
                                    disabled={!testInput.trim() || testStatus === 'testing'}
                                    size="sm"
                                    className="flex-shrink-0"
                                >
                                    {testStatus === 'testing' ? (
                                        <Loader className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Test Response */}
                        {testResponse && (
                            <div className="space-y-2 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-foreground">
                                        模型响应
                                    </label>
                                    {testStatus === 'success' && (
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <Check className="h-3.5 w-3.5" />
                                            成功
                                        </div>
                                    )}
                                    {testStatus === 'error' && (
                                        <div className="flex items-center gap-1 text-xs text-red-600">
                                            <AlertCircle className="h-3.5 w-3.5" />
                                            失败
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/30 text-sm text-foreground leading-relaxed">
                                    {testResponse}
                                </div>
                            </div>
                        )}

                        {/* Test History */}
                        {testHistory.length > 0 && (
                            <div className="space-y-2 animate-fadeInUp border-t pt-4" style={{ animationDelay: '300ms' }}>
                                <h4 className="text-sm font-semibold text-foreground">测试历史</h4>
                                <div className="space-y-2">
                                    {testHistory.map((item, idx) => (
                                        <div key={idx} className="p-3 rounded-lg bg-muted/30 border border-border/30 text-xs space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className="font-medium text-foreground">Q: {item.q}</p>
                                                <span className="text-muted-foreground flex-shrink-0">{item.time}</span>
                                            </div>
                                            <p className="text-muted-foreground">A: {item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!testResponse && testStatus === 'idle' && (
                            <div className="py-8 text-center text-muted-foreground space-y-3">
                                <Zap className="h-12 w-12 mx-auto opacity-20" />
                                <p className="text-sm">输入问题开始测试模型</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border/30 bg-background flex gap-3 flex-shrink-0">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleReset}
                            disabled={testStatus === 'testing'}
                        >
                            重置
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            关闭
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}