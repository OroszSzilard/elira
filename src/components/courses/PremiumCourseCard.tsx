'use client';

import { motion } from "motion/react";
import { BookOpen, Clock, Star, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cardStyles, buttonStyles } from "@/lib/design-tokens";

interface Course {
  id: string;
  title: string;
  description: string;
  instructorName?: string;
  category: string;
  level: string;
  duration: string;
  rating?: number;
  students?: number;
  enrollmentCount?: number;
  price: number;
  imageUrl?: string;
  lessons?: number;
}

interface PremiumCourseCardProps {
  course: Course;
  index: number;
}

export function PremiumCourseCard({ course, index }: PremiumCourseCardProps) {
  const router = useRouter();

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
      case 'kezdő':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#10B981'
        };
      case 'intermediate':
      case 'középhaladó':
        return {
          bg: 'rgba(251, 191, 36, 0.1)',
          border: 'rgba(251, 191, 36, 0.3)',
          text: '#F59E0B'
        };
      case 'advanced':
      case 'haladó':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: '#EF4444'
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          border: 'rgba(107, 114, 128, 0.3)',
          text: '#6B7280'
        };
    }
  };

  const levelColors = getLevelColor(course.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05, // Stagger effect
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -4 }}
    >
      <div
        className={`${cardStyles.flat} overflow-hidden h-full flex flex-col group cursor-pointer`}
        onClick={() => router.push(`/courses/${course.id}`)}
        style={{
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04)';
        }}
      >
        {/* Course Image */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(70, 108, 149, 0.1) 0%, rgba(70, 108, 149, 0.05) 100%)'
              }}
            >
              <BookOpen className="w-12 h-12 text-[#466C95]  opacity-40" />
            </div>
          )}

          {/* Price Badge - Glassmorphic */}
          {course.price === 0 ? (
            <div
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(16, 185, 129, 0.95)',
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
              }}
            >
              INGYENES
            </div>
          ) : (
            <div
              className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                color: '#1F2937',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              {course.price?.toLocaleString() || '0'} Ft
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5">
          {/* Category and Level Badges */}
          <div className="flex items-center justify-between mb-3">
            <div
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{
                background: 'rgba(70, 108, 149, 0.08)',
                border: '1px solid rgba(70, 108, 149, 0.15)',
                color: '#466C95'
              }}
            >
              {course.category}
            </div>
            {course.level && (
              <div
                className="px-2.5 py-1 rounded-md text-xs font-medium"
                style={{
                  background: levelColors.bg,
                  border: `1px solid ${levelColors.border}`,
                  color: levelColors.text
                }}
              >
                {course.level}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#466C95] transition-colors duration-200">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
            {course.description}
          </p>

          {/* Instructor */}
          {course.instructorName && (
            <p className="text-xs text-gray-500 mb-3">
              Oktató: <span className="font-medium">{course.instructorName}</span>
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
            {course.duration && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.duration}</span>
              </div>
            )}
            {course.lessons && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{course.lessons} lecke</span>
              </div>
            )}
            {course.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            className={`w-full ${buttonStyles.primaryLight} !rounded-lg !py-2.5 text-sm`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/courses/${course.id}`);
            }}
          >
            <Play className="w-4 h-4" />
            <span>Megtekintés</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
