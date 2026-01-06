import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/Card';

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

// 更多评价数据
const testimonials: Testimonial[] = [
  {
    id: '1',
    content: '我们使用 DocQA 处理海量研报，分析师的工作效率提升了 60%。AI 问答的准确率令人印象深刻。',
    author: '张明',
    role: '首席分析师',
    company: '华创证券',
    avatar: 'Z',
    rating: 5,
  },
  {
    id: '2',
    content: '作为一家律所，我们每天需要查阅大量法律文献。这个平台帮助我们快速定位关键条款，节省了大量时间。',
    author: '李婷',
    role: '合伙人',
    company: '金杜律师事务所',
    avatar: 'L',
    rating: 5,
  },
  {
    id: '3',
    content: '技术文档管理一直是我们的痛点。DocQA 不仅解决了检索问题，还会智能回答技术问题，非常实用。',
    author: '王强',
    role: 'CTO',
    company: '字节跳动',
    avatar: 'W',
    rating: 5,
  },
  {
    id: '4',
    content: '产品上线后，客服团队的响应速度提升了 3 倍，客户满意度显著提高。强烈推荐！',
    author: '陈晓',
    role: '客服总监',
    company: '美团',
    avatar: 'C',
    rating: 5,
  },
  {
    id: '5',
    content: '知识库管理变得前所未有的简单，新员工培训周期缩短了一半。这是我们用过最好的知识管理工具。',
    author: '刘洋',
    role: 'HR总监',
    company: '小米科技',
    avatar: 'L',
    rating: 5,
  },
  {
    id: '6',
    content: '医疗文献检索效率提升明显，帮助医生快速获取诊疗参考信息。对医疗行业帮助很大。',
    author: '赵医生',
    role: '主任医师',
    company: '协和医院',
    avatar: 'Z',
    rating: 5,
  },
  {
    id: '7',
    content: '合同审查效率提升 80%，风险点识别更加精准。法务团队现在离不开这个工具了。',
    author: '孙磊',
    role: '法务总监',
    company: '阿里巴巴',
    avatar: 'S',
    rating: 5,
  },
  {
    id: '8',
    content: '教学资料整理变得轻松高效，学生可以直接向系统提问获取知识点解答。教育创新的典范！',
    author: '周老师',
    role: '教授',
    company: '清华大学',
    avatar: 'Z',
    rating: 5,
  },
  {
    id: '9',
    content: '投研报告生成效率大幅提升，数据提取准确率高达 95%。投资决策更加科学。',
    author: '钱程',
    role: '投资总监',
    company: '红杉资本',
    avatar: 'Q',
    rating: 5,
  },
];

// 将评论分成三行用于展示
// const row1 = testimonials.slice(0, 3);
// const row2 = testimonials.slice(3, 6);
// const row3 = testimonials.slice(6, 9);

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="w-80 md:w-96 flex-shrink-0 mx-3 group hover:shadow-enhance hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-full blur-2xl -mr-16 -mt-16" />

      <CardContent className="pt-5 pb-5 relative">
        {/* Star Rating with enhanced animation */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <div
              key={i}
              className="relative"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="absolute inset-0 bg-amber-400/20 rounded blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Star
                className="h-4 w-4 fill-amber-400 text-amber-400 transition-all duration-300 group-hover:scale-110 relative"
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 group-hover:text-muted-foreground/90 transition-colors">
          "{testimonial.content}"
        </p>

        {/* Author Info - 优化布局，类似数据统计卡片 */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/30 group-hover:border-primary/50 transition-colors">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-125" />
            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/40 group-hover:to-primary/20 flex items-center justify-center text-sm font-semibold text-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
              {testimonial.avatar}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {testimonial.author}
            </div>
            <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 truncate">
              {testimonial.role}
            </div>
            <div className="text-xs text-primary/70 group-hover:text-primary font-medium truncate">
              {testimonial.company}
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 group-hover:w-full transition-all duration-300" />
      </CardContent>
    </Card>
  );
}

function MarqueeRow({
  items,
  direction = 'left',
  speed = 30,
}: {
  items: Testimonial[];
  direction?: 'left' | 'right';
  speed?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = direction === 'left' ? 0 : scrollContainer.scrollWidth / 2;

    const scroll = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(scroll);
        return;
      }

      if (direction === 'left') {
        scrollPos += 0.5;
        if (scrollPos >= scrollContainer.scrollWidth / 2) {
          scrollPos = 0;
        }
      } else {
        scrollPos -= 0.5;
        if (scrollPos <= 0) {
          scrollPos = scrollContainer.scrollWidth / 2;
        }
      }

      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [direction, isPaused, speed]);

  const duplicatedItems = [...items, ...items];

  return (
    <div
      ref={scrollRef}
      className="flex overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex">
        {duplicatedItems.map((item, index) => (
          <TestimonialCard key={`${item.id}-${index}`} testimonial={item} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialCarousel() {
  return (
    <div className="space-y-4 overflow-hidden -mx-4 md:-mx-8 lg:-mx-16">
      <MarqueeRow items={testimonials.slice(0, 3)} direction="left" />
      <MarqueeRow items={testimonials.slice(3, 6)} direction="right" />
      <MarqueeRow items={testimonials.slice(6, 9)} direction="left" />
    </div>
  );
}
