"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { httpsCallable } from 'firebase/functions';
import { functions as fbFunctions } from '@/lib/firebase';
import { Upload, X, Loader2 } from "lucide-react";
import { useCourseWizardStore } from "@/stores/courseWizardStore";
import { useAuthStore } from "@/stores/authStore";

interface Category { id: string; name: string }
interface Instructor { id: string; firstName: string; lastName: string }

export interface BasicInfoData {
  title: string;
  description: string;
  categoryId: string;
  instructorId: string;
  language: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  certificateEnabled: boolean;
  thumbnailUrl?: string;
  learningObjectives: string;
}

interface Props {
  initial?: BasicInfoData;
  onSubmit: (data: BasicInfoData) => Promise<void>;
}

const schema = z.object({
  title: z.string().min(3, "A cím legalább 3 karakter legyen"),
  description: z.string().min(10, "A leírás legalább 10 karakter legyen"),
  categoryId: z.string().min(1, "Válassz kategóriát"),
  instructorId: z.string().min(1, "Válassz oktatót"),
  language: z.string().min(1, "Válassz nyelvet"),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  certificateEnabled: z.boolean(),
  thumbnailUrl: z.string().optional(),
  learningObjectives: z.string().min(10, "A tanulási célok legalább 10 karakter legyen"),
});

export default function CourseBasicInfoStep({ initial, onSubmit }: Props) {
  const { setValidationErrors, clearValidationErrors } = useCourseWizardStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<BasicInfoData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: initial || {
      title: "",
      description: "",
      categoryId: "",
      instructorId: "",
      language: "hu",
      difficulty: "BEGINNER",
      certificateEnabled: false,
      thumbnailUrl: "",
      learningObjectives: "",
    },
  });

  const { authReady, isAuthenticated, user } = useAuthStore();

  // Load categories and instructors
  useEffect(() => {
    const loadData = async () => {
      // Wait for auth to be ready
      if (!authReady) {
        return;
      }

      setIsLoading(true);
      
      try {
        // Load categories
        const getCategoriesFn = httpsCallable(fbFunctions, 'getCategories');
        const catRes: any = await getCategoriesFn();
        if (catRes.data?.success) {
          setCategories(catRes.data.categories || []);
        } else {
          console.warn('Categories load failed:', catRes.data?.error);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error("Kategóriák betöltése sikertelen");
      }

      // Only load instructors if authenticated
      if (isAuthenticated && user) {
        try {
          // Load instructors
          const getInstructorsFn = httpsCallable(fbFunctions, "getInstructors");
          const userRes: any = await getInstructorsFn();
          if (userRes.data?.success) {
            setInstructors(userRes.data.instructors || []);
            console.log('✅ Instructors loaded:', userRes.data.instructors);
          } else {
            console.warn('Instructors load failed:', userRes.data?.error);
            toast.error(userRes.data?.error || "Oktatók betöltése sikertelen");
          }
        } catch (error) {
          console.error('Failed to load instructors:', error);
          toast.error("Oktatók betöltése sikertelen - ellenőrizze a bejelentkezést");
        }
      } else {
        console.warn('Not authenticated, skipping instructors load');
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [authReady, isAuthenticated, user]);

  // Track validation errors
  useEffect(() => {
    const errorMessages = Object.values(errors).map(e => e?.message || '').filter(Boolean);
    if (errorMessages.length > 0) {
      setValidationErrors('step1', errorMessages);
    } else {
      clearValidationErrors('step1');
    }
  }, [errors, setValidationErrors, clearValidationErrors]);

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('A fájl mérete maximum 5MB lehet');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Csak JPEG, PNG vagy WebP képek engedélyezettek');
      return;
    }

    setThumbnailUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setValue('thumbnailUrl', base64);
        setThumbnailFile(file);
        toast.success('Thumbnail feltöltve');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error('Thumbnail feltöltési hiba:', err);
      toast.error('Thumbnail feltöltési hiba');
    } finally {
      setThumbnailUploading(false);
    }
  };

  const onFormSubmit = async (data: BasicInfoData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const thumbnailUrl = watch('thumbnailUrl');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" required>Kurzus címe</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="pl. React alapok kezdőknek"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" required>Kategória</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  trigger('categoryId');
                }}
              >
                <SelectTrigger id="category" className={errors.categoryId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Válassz kategóriát" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Instructor */}
        <div className="space-y-2">
          <Label htmlFor="instructor" required>Oktató</Label>
          <Controller
            name="instructorId"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  trigger('instructorId');
                }}
              >
                <SelectTrigger id="instructor" className={errors.instructorId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Válassz oktatót" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.firstName} {instructor.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.instructorId && (
            <p className="text-sm text-red-600">{errors.instructorId.message}</p>
          )}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label htmlFor="language" required>Nyelv</Label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hu">Magyar</SelectItem>
                  <SelectItem value="en">Angol</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label htmlFor="difficulty" required>Nehézségi szint</Label>
          <Controller
            name="difficulty"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Kezdő</SelectItem>
                  <SelectItem value="INTERMEDIATE">Középhaladó</SelectItem>
                  <SelectItem value="ADVANCED">Haladó</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Certificate */}
        <div className="space-y-2">
          <Label htmlFor="certificate">Tanúsítvány</Label>
          <div className="flex items-center space-x-2">
            <Controller
              name="certificateEnabled"
              control={control}
              render={({ field }) => (
                <Switch
                  id="certificate"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="certificate" className="font-normal cursor-pointer">
              Tanúsítvány engedélyezése
            </Label>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" required>Leírás</Label>
        <Textarea
          id="description"
          {...register("description")}
          rows={4}
          placeholder="Írd le, miről szól a kurzus és mit fognak tanulni a résztvevők..."
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Learning Objectives */}
      <div className="space-y-2">
        <Label htmlFor="objectives" required>Tanulási célok</Label>
        <Textarea
          id="objectives"
          {...register("learningObjectives")}
          rows={4}
          placeholder="Mit fog megtanulni a diák a kurzus végére? (Soronként egy cél)"
          className={errors.learningObjectives ? "border-red-500" : ""}
        />
        {errors.learningObjectives && (
          <p className="text-sm text-red-600">{errors.learningObjectives.message}</p>
        )}
      </div>

      {/* Thumbnail Upload */}
      <div className="space-y-2">
        <Label>Kurzus borítókép</Label>
        {!thumbnailUrl ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleThumbnailUpload(file);
              }}
              className="hidden"
              id="thumbnail-upload"
              disabled={thumbnailUploading}
            />
            <label
              htmlFor="thumbnail-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              {thumbnailUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Kattints vagy húzd ide a képet
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    JPEG, PNG vagy WebP (max 5MB)
                  </span>
                </>
              )}
            </label>
          </div>
        ) : (
          <div className="relative inline-block">
            <Image
              src={thumbnailUrl}
              alt="Kurzus borítókép"
              width={300}
              height={169}
              className="rounded-lg border"
            />
            <button
              type="button"
              onClick={() => {
                setValue('thumbnailUrl', '');
                setThumbnailFile(null);
              }}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full h-6 w-6 flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mentés...
            </>
          ) : (
            'Mentés és tovább'
          )}
        </Button>
      </div>
    </form>
  );
}