import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Search,
  Shield,
  Zap,
  Globe,
  Award,
  Building2,
  ArrowRight,
  Mail,
  Phone,
  CheckCircle,
  BookOpen,
} from 'lucide-react';
import { PageTransition } from '@/shared/components/PageTransition';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { CultureValues } from '../components/CultureValues';
import { DemoBookingDialog } from '../components/DemoBookingDialog';
import { Logo } from '@/shared/components/ui/Logo';
import { ScrollablePageLayout } from '@/shared/components/layout/ScrollablePageLayout';

// 核心功能
const features = [
  {
    icon: FileText,
    title: '智能文档解析',
    description: '支持 PDF、Word、Markdown 等多种格式，自动提取关键信息并建立知识索引',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: MessageSquare,
    title: 'AI 智能问答',
    description: '基于先进的 RAG 技术，精准理解文档内容，提供准确的答案',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: Search,
    title: '全文搜索',
    description: '毫秒级的全文搜索能力，快速定位相关内容',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: Shield,
    title: '数据安全',
    description: '企业级加密存储，完全保护您的数据隐私',
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    icon: Zap,
    title: '快速响应',
    description: '平均响应时间 < 200ms，超快的交互体验',
    gradient: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Globe,
    title: '多语言支持',
    description: '支持中、英、日、韩等 10+ 语言的文档处理与问答',
    gradient: 'from-indigo-500 to-indigo-600',
  },
];

// 数据统计
const stats = [
  { value: '10M+', label: '处理文档数', icon: FileText, color: 'from-blue-500 to-blue-600' },
  { value: '500+', label: '企业客户', icon: Building2, color: 'from-green-500 to-green-600' },
  { value: '99.9%', label: '服务可用性', icon: Shield, color: 'from-purple-500 to-purple-600' },
  { value: '< 200ms', label: '平均响应时间', icon: Zap, color: 'from-orange-500 to-orange-600' },
];

// 荣誉资质
const awards = [
  { icon: Award, title: '国家高新技术企业', description: '入选国家高新技术企业名录' },
  { icon: Shield, title: 'ISO 27001 认证', description: '信息安全管理体系认证' },
  { icon: CheckCircle, title: 'SOC 2 Type II', description: '安全运维认证' },
  { icon: Award, title: '中国AI创新奖', description: '年度最佳AI创新产品' },
];

// 合作伙伴
const partners = [
  '字节跳动', '美团', '滴滴', '拼多多',
  '阿里云', '腾讯云', '华为云', 'AWS',
  '微软', 'OpenAI', '百度', '科大讯飞',
];

export default function HomePage() {
  const [demoDialogOpen, setDemoDialogOpen] = useState(false);

  return (
    <>
      <PageTransition>
        <ScrollablePageLayout 
          hideBottomNav={false}
          fullWidth={false}
          maxWidth="max-w-6xl"
          contentPadding="px-3 sm:px-4 md:px-6 py-6 md:py-8"
        >
          <div className="space-y-16 md:space-y-24 lg:space-y-32">
            {/* Hero Section */}
            <section className="relative py-8 md:py-16 lg:py-24">
              <div className="mx-auto max-w-4xl text-center space-y-6 md:space-y-8">
                {/* Main Heading */}
                <h1
                  className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight animate-fadeInUp leading-tight"
                  style={{ animationDelay: '80ms' }}
                >
                  让文档开口说话
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    智能问答，精准高效
                  </span>
                </h1>

                {/* Subheading */}
                <p
                  className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fadeInUp"
                  style={{ animationDelay: '160ms' }}
                >
                  上传您的文档，即刻获得 AI 助手。无论是研报分析、合同审查还是技术文档检索，
                  我们帮助您从海量信息中快速获取答案。
                </p>

                {/* CTA Buttons */}
                <div
                  className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4 md:pt-6 animate-fadeInUp"
                  style={{ animationDelay: '240ms' }}
                >
                  <Link to="/chat" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full text-sm md:text-base px-6 md:px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95">
                      免费开始使用
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/documents" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-sm md:text-base px-6 md:px-8 hover:bg-primary/5 hover:shadow-md transition-all duration-300 border-border/50"
                    >
                      上传文档体验
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Stats Section - 优化设计，减少上下间距 */}
            <section className="py-8 md:py-12 bg-gradient-to-r from-primary/3 via-background to-primary/3 rounded-2xl animate-fadeInUp px-4 md:px-6" style={{ animationDelay: '320ms' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="text-center space-y-2 group cursor-pointer transition-all duration-300 hover:scale-105 relative"
                      style={{ animationDelay: `${400 + idx * 60}ms` }}
                    >
                      {/* Background glow effect */}
                      <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl -z-10`} />
                      
                      <div className="inline-flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 group-hover:shadow-md group-hover:scale-110 transition-all duration-300 mx-auto">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
                      </div>
                      <div className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Features Section - 彩色卡片网格 */}
            <section className="space-y-10 md:space-y-12 animate-fadeInUp" style={{ animationDelay: '560ms' }}>
              <div className="text-center space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">核心功能</h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  基于先进的 RAG 技术架构，为企业提供安全、高效、智能的文档问答解决方案
                </p>
              </div>

              <div className="grid gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="group overflow-hidden hover:shadow-enhance animate-scaleIn hover:-translate-y-1 transition-all duration-300"
                      style={{ animationDelay: `${640 + idx * 60}ms` }}
                    >
                      {/* Gradient background overlay */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-full blur-3xl -mr-16 -mt-16`} />
                      
                      <CardContent className="pt-6 relative">
                        {/* Icon with gradient background */}
                        <div className={`h-12 w-12 rounded-lg md:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-base md:text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                          {feature.description}
                        </p>

                        {/* Bottom accent line */}
                        <div className={`h-0.5 w-0 bg-gradient-to-r ${feature.gradient} mt-4 group-hover:w-full transition-all duration-300`} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Awards Section - 增强视觉效果 */}
            <section className="py-12 md:py-16 animate-fadeInUp" style={{ animationDelay: '880ms' }}>
              <div className="text-center space-y-8 md:space-y-12">
                <h2 className="text-3xl md:text-4xl font-bold">荣誉资质</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {awards.map((award, idx) => {
                    const Icon = award.icon;
                    return (
                      <div
                        key={award.title}
                        className="group relative overflow-hidden rounded-xl border border-border/30 bg-background/50 animate-fadeInUp transition-all duration-300 hover:shadow-md hover:border-primary/50"
                        style={{ animationDelay: `${960 + idx * 60}ms` }}
                      >
                        {/* Background glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="p-4 md:p-6 space-y-4 flex flex-col items-center justify-center text-center relative z-10">
                          {/* Icon container with glow */}
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />
                            <div className="relative h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/40 group-hover:to-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                          </div>

                          {/* Title - 常显 */}
                          <h3 className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {award.title}
                          </h3>

                          {/* Description - 常显 */}
                          <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                            {award.description}
                          </p>
                        </div>

                        {/* Animated border bottom */}
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 group-hover:w-full transition-all duration-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Culture Values Section */}
            <div className="animate-fadeInUp" style={{ animationDelay: '1200ms' }}>
              <CultureValues />
            </div>

            {/* Testimonials Section */}
            <section className="space-y-8 md:space-y-10 animate-fadeInUp" style={{ animationDelay: '1400ms' }}>
              <div className="text-center space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">客户评价</h2>
                <p className="text-base md:text-lg text-muted-foreground">来自各行业领先企业的真实反馈</p>
              </div>
              <TestimonialCarousel />
            </section>

            {/* Partners Section */}
            <section className="space-y-8 md:space-y-10 animate-fadeInUp" style={{ animationDelay: '1600ms' }}>
              <div className="text-center space-y-3 md:space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">合作伙伴</h2>
                <p className="text-base md:text-lg text-muted-foreground">携手行业领先企业，共建智能生态</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {partners.map((partner, idx) => (
                  <div
                    key={partner}
                    className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg border border-border/30 bg-gradient-to-br from-background to-muted/30 text-muted-foreground font-medium text-xs md:text-sm hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-sm hover:scale-105 transition-all duration-300 animate-scaleIn cursor-pointer"
                    style={{ animationDelay: `${1680 + idx * 40}ms` }}
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section
              className="py-12 md:py-16 bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground rounded-2xl text-center animate-fadeInUp px-6 md:px-8 relative overflow-hidden"
              style={{ animationDelay: '1920ms' }}
            >
              {/* Background effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48" />

              <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 relative z-10">
                <div className="space-y-2 md:space-y-4">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">准备好提升您的工作效率了吗？</h2>
                  <p className="opacity-90 text-sm md:text-base leading-relaxed">
                    立即注册，免费试用 14 天。无需信用卡，随时可取消。
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-4">
                  <Link to="/chat" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full text-sm md:text-base px-6 md:px-8 hover:shadow-lg transition-all duration-300"
                    >
                      立即开始
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 bg-white/20 hover:bg-white/30 border-white/50 text-primary-foreground transition-all duration-300 hover:shadow-lg"
                    onClick={() => setDemoDialogOpen(true)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    预约演示
                  </Button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/30 pt-12 md:pt-16 animate-fadeInUp" style={{ animationDelay: '2080ms' }}>
              <div className="space-y-8 md:space-y-12">
                <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Company Info */}
                  <div className="md:col-span-2 lg:col-span-1 space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="h-8 md:h-10 w-8 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center p-1 border border-primary/20">
                        <Logo className="h-6 md:h-8 w-6 md:w-8 text-primary" />
                      </div>
                      <span className="text-lg md:text-xl font-bold text-primary">DocQA</span>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      我们致力于通过人工智能技术，帮助企业和个人更高效地管理和利用知识资产。
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2 md:space-y-4">
                    <h4 className="font-semibold text-xs md:text-sm">产品</h4>
                    <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                      <li>
                        <Link to="/documents" className="hover:text-primary transition-colors">
                          文档管理
                        </Link>
                      </li>
                      <li>
                        <Link to="/chat" className="hover:text-primary transition-colors">
                          智能问答
                        </Link>
                      </li>
                      <li>
                        <a href="#" className="hover:text-primary transition-colors">
                          API 接口
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Company Links */}
                  <div className="space-y-2 md:space-y-4">
                    <h4 className="font-semibold text-xs md:text-sm">公司</h4>
                    <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                      <li>
                        <a href="#" className="hover:text-primary transition-colors">
                          关于我们
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-primary transition-colors">
                          企业版
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-primary transition-colors">
                          博客
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 md:space-y-4">
                    <h4 className="font-semibold text-xs md:text-sm">联系我们</h4>
                    <ul className="space-y-1 md:space-y-3 text-xs md:text-sm text-muted-foreground">
                      <li className="flex items-center gap-2 group">
                        <Mail className="h-3 md:h-4 w-3 md:w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span>contact@docqa.ai</span>
                      </li>
                      <li className="flex items-center gap-2 group">
                        <Phone className="h-3 md:h-4 w-3 md:w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span>400-888-9999</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 md:pt-8 border-t border-border/30 text-center space-y-2 text-xs md:text-sm text-muted-foreground">
                  <p>© 2024 DocQA. All rights reserved.</p>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    <a href="#" className="hover:text-primary transition-colors">
                      隐私政策
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                      服务条款
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                      京ICP备xxxxxxxx号
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ScrollablePageLayout>
      </PageTransition>

      {/* Demo Booking Dialog */}
      <DemoBookingDialog open={demoDialogOpen} onOpenChange={setDemoDialogOpen} />
    </>
  );
}
