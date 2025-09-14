 "use client";
 import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ArticleManagementPage: React.FC = () => {
    const router = useRouter();
    // State สำหรับจัดการข้อมูลฟอร์ม
    const [formData, setFormData] = useState({
        ownerFirstName: '',
        ownerLastName: '',
        contributors: [{ firstName: '', lastName: '' }],
        title: '',
        articleType: '',
        position: '',
        date: '',
        abstract: '',
        publishRights: 'publish' as 'publish' | 'not-publish',
        file: null as File | null
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // เพิ่มผู้ร่วมบทความ
    const addContributor = () => {
        setFormData(prev => ({
            ...prev,
            contributors: [...prev.contributors, { firstName: '', lastName: '' }]
        }));
    };

    // ลบผู้ร่วมบทความ
    const removeContributor = (index: number) => {
        if (formData.contributors.length > 1) {
            setFormData(prev => ({
                ...prev,
                contributors: prev.contributors.filter((_, i) => i !== index)
            }));
        }
    };

    // อัปเดตข้อมูลผู้ร่วมบทความ
    const updateContributor = (index: number, field: 'firstName' | 'lastName', value: string) => {
        setFormData(prev => ({
            ...prev,
            contributors: prev.contributors.map((contributor, i) => 
                i === index ? { ...contributor, [field]: value } : contributor
            )
        }));
    };

    // จัดการการอัปโหลดไฟล์
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, file }));
    };

    // ตรวจสอบข้อมูล
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.ownerFirstName.trim()) {
            newErrors.ownerFirstName = 'กรุณากรอกชื่ออาจารย์เจ้าของบทความ';
        }
        if (!formData.ownerLastName.trim()) {
            newErrors.ownerLastName = 'กรุณากรอกนามสกุลอาจารย์เจ้าของบทความ';
        }

        formData.contributors.forEach((contributor, index) => {
            if (!contributor.firstName.trim()) {
                newErrors[`contributor_${index}_firstName`] = 'กรุณากรอกชื่อผู้ร่วมบทความ';
            }
            if (!contributor.lastName.trim()) {
                newErrors[`contributor_${index}_lastName`] = 'กรุณากรอกนามสกุลผู้ร่วมบทความ';
            }
        });

        if (!formData.title.trim()) {
            newErrors.title = 'กรุณากรอกชื่อบทความ';
        }
        if (!formData.articleType) {
            newErrors.articleType = 'กรุณาเลือกประเภทงาน';
        }
        if (!formData.position.trim()) {
            newErrors.position = 'กรุณากรอกตำแหน่งอาจารย์';
        }
        if (!formData.date) {
            newErrors.date = 'กรุณาเลือกวันที่';
        }
        if (!formData.abstract.trim()) {
            newErrors.abstract = 'กรุณากรอกบทคัดย่อ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // แปลงประเภทงานจากค่า value -> ป้ายภาษาไทย
    const mapArticleType = (val: string): string => {
        switch (val) {
            case 'research':
                return 'งานวิจัย';
            case 'review':
                return 'บทความทบทวน';
            case 'proceedings':
                return 'ประชุมวิชาการ';
            case 'other':
                return 'อื่น ๆ';
            default:
                return val || 'อื่น ๆ';
        }
    };

    // แปลงวันที่เป็น dd/mm/yyyy
    const formatDate = (iso: string): string => {
        if (!iso) return '';
        const d = new Date(iso);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = String(d.getFullYear());
        return `${dd}/${mm}/${yyyy}`;
    };

    // อ่าน/เขียน localStorage อย่างปลอดภัย
    const safeReadLocal = <T,>(key: string, fallback: T): T => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
            if (!raw) return fallback;
            return JSON.parse(raw) as T;
        } catch {
            return fallback;
        }
    };

    const safeWriteLocal = (key: string, value: unknown) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value));
            }
        } catch {
            // ignore quota or serialization errors
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            // จำลองการส่งข้อมูล
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // สร้าง record ใหม่ตามรูปแบบที่หน้า Article Management ใช้
            const uploadDate = formatDate(formData.date);
            const publishYear = formData.date ? String(new Date(formData.date).getFullYear()) : '';
            const newRecord = {
                หัวข้อ: formData.title,
                วันที่อัปโหลด: uploadDate,
                ปีที่พิมพ์: publishYear,
                ประเภท: mapArticleType(formData.articleType),
                สถานะ: 'กำลังตรวจ',
            };

            // บันทึกลง localStorage ภายใต้ key 'myArticles'
            const current = safeReadLocal<typeof newRecord[]>("myArticles", []);
            current.unshift(newRecord); // ใส่รายการใหม่ไว้บนสุด
            safeWriteLocal("myArticles", current);

            // แจ้งผู้ใช้และไปหน้า articlemanagement
            alert('บันทึกข้อมูลสำเร็จ!');
            router.push('/articlemanagement');
            
            // รีเซ็ตฟอร์ม
            setFormData({
                ownerFirstName: '',
                ownerLastName: '',
                contributors: [{ firstName: '', lastName: '' }],
                title: '',
                articleType: '',
                position: '',
                date: '',
                abstract: '',
                publishRights: 'publish',
                file: null
            });
            setErrors({});
        } catch (error) {
            console.error('Error submitting article:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsSubmitting(false);
        }
    };

    // จัดการการยกเลิก
    const handleCancel = () => {
        setFormData({
            ownerFirstName: '',
            ownerLastName: '',
            contributors: [{ firstName: '', lastName: '' }],
            title: '',
            articleType: '',
            position: '',
            date: '',
            abstract: '',
            publishRights: 'publish',
            file: null
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-base-200 px-4 py-10">
            <div className="w-full max-w-4xl bg-base-100 rounded-2xl shadow-lg p-8 md:p-10">
                
                <div className="w-full flex justify-left mb-6">
                    <p className="text-xl font-bold">เพิ่มบทความ</p>
                </div>

                <div className="w-6/7 flex flex-col justify-center items-center">

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
                        {/* อาจารย์เจ้าของบทความ */}
                        <div>
                            <label className="text-xs font-medium">
                                อาจารย์เจ้าของบทความ <span className="text-error">*</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <input
                                        className={`input input-bordered w-full ${errors.ownerFirstName ? 'input-error' : ''}`}
                                        placeholder="ชื่อ"
                                        value={formData.ownerFirstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ownerFirstName: e.target.value }))}
                                    />
                                    {errors.ownerFirstName && (
                                        <span className="text-error text-xs mt-1 block">{errors.ownerFirstName}</span>
                                    )}
                                </div>
                                <div>
                                    <input
                                        className={`input input-bordered w-full ${errors.ownerLastName ? 'input-error' : ''}`}
                                        placeholder="นามสกุล"
                                        value={formData.ownerLastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ownerLastName: e.target.value }))}
                                    />
                                    {errors.ownerLastName && (
                                        <span className="text-error text-xs mt-1 block">{errors.ownerLastName}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ผู้ร่วมบทความ */}
                        <div>
                            <label className="text-xs font-medium">
                                ผู้ร่วมบทความ <span className="text-error">*</span>
                            </label>
                            {formData.contributors.map((contributor, index) => (
                                <div key={index} className="mb-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <input
                                                className={`input input-bordered w-full ${errors[`contributor_${index}_firstName`] ? 'input-error' : ''}`}
                                                placeholder="ชื่อ"
                                                value={contributor.firstName}
                                                onChange={(e) => updateContributor(index, 'firstName', e.target.value)}
                                            />
                                            {errors[`contributor_${index}_firstName`] && (
                                                <span className="text-error text-xs mt-1 block">{errors[`contributor_${index}_firstName`]}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <input
                                                    className={`input input-bordered w-full ${errors[`contributor_${index}_lastName`] ? 'input-error' : ''}`}
                                                    placeholder="นามสกุล"
                                                    value={contributor.lastName}
                                                    onChange={(e) => updateContributor(index, 'lastName', e.target.value)}
                                                />
                                                {errors[`contributor_${index}_lastName`] && (
                                                    <span className="text-error text-xs mt-1 block">{errors[`contributor_${index}_lastName`]}</span>
                                                )}
                                            </div>
                                            {formData.contributors.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-error btn-sm"
                                                    onClick={() => removeContributor(index)}
                                                >
                                                    ลบ
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ปุ่มเพิ่มผู้ร่วมบทความ */}
                        <div>
                            <button 
                                type="button" 
                                className="btn btn-ghost mt-2 gap-2"
                                onClick={addContributor}
                            >
                                + เพิ่มผู้ร่วมบทความ
                            </button>
                        </div>

                        {/* ชื่อบทความ */}
                        <div>
                            <label className="text-xs font-medium">
                                ชื่อบทความ<span className="text-error">*</span>
                            </label>
                            <div className="w-full relative">
                                <input 
                                    type="text"
                                    className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                />
                                {errors.title && (
                                    <span className="text-error text-xs mt-1 block">{errors.title}</span>
                                )}
                            </div>
                        </div>
                        
                        {/* ประเภทงาน */}
                        <div>
                            <label className="text-xs font-medium">ประเภทงาน<span className="text-error">*</span></label>
                            <div className="w-full relative">
                                <select 
                                    className={`select select-bordered w-full ${errors.articleType ? 'select-error' : ''}`}
                                    value={formData.articleType}
                                    onChange={(e) => setFormData(prev => ({ ...prev, articleType: e.target.value }))}
                                >
                                    <option value="">— เลือกประเภทงาน —</option>
                                    <option value="research">บทความวิจัย (Research Article)</option>
                                    <option value="review">บทความทบทวน (Review Article)</option>
                                    <option value="proceedings">บทความประชุมวิชาการ (Proceedings)</option>
                                    <option value="other">อื่น ๆ</option>
                                </select>
                                {errors.articleType && (
                                    <span className="text-error text-xs mt-1 block">{errors.articleType}</span>
                                )}
                            </div>
                        </div>

                        {/* ตำแหน่งอาจารย์ */}
                        <div>
                            <label className="text-xs font-medium">ตำแหน่งอาจารย์<span className="text-error">*</span></label>
                            <div className="w-full relative">
                                <input 
                                    type="text"
                                    className={`input input-bordered w-full ${errors.position ? 'input-error' : ''}`}
                                    value={formData.position}
                                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                />
                                {errors.position && (
                                    <span className="text-error text-xs mt-1 block">{errors.position}</span>
                                )}
                            </div>
                        </div>

                        {/* วัน เดือน ปี */}
                        <div>
                            <label className="text-xs font-medium">วัน เดือน ปี<span className="text-error">*</span></label>
                            <div className="w-full relative">
                                <input 
                                    type="date"
                                    className={`input input-bordered w-full pr-10 ${errors.date ? 'input-error' : ''}`}
                                    value={formData.date}
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                />
                                {errors.date && (
                                    <span className="text-error text-xs mt-1 block">{errors.date}</span>
                                )}
                            </div>
                        </div>

                        {/* บทคัดย่อ */}
                        <div>
                            <label className="text-xs font-medium">บทคัดย่อ<span className="text-error">*</span></label>
                            <div className="w-full relative">
                                <textarea
                                    className={`textarea textarea-bordered w-full min-h-36 ${errors.abstract ? 'textarea-error' : ''}`}
                                    value={formData.abstract}
                                    onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                                />
                                {errors.abstract && (
                                    <span className="text-error text-xs mt-1 block">{errors.abstract}</span>
                                )}
                            </div>
                        </div>

                        {/* สิทธิ์การเผยแพร่บทความ */}
                        <div>
                            <label className="text-xs font-medium">
                                <span className="label-text text-sm font-medium">
                                    สิทธิ์ในการเผยแพร่บทความ
                                </span>
                            </label>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                <label className="label cursor-pointer gap-2">
                                    <input 
                                        type="radio" 
                                        name="rights" 
                                        className="radio" 
                                        value="publish"
                                        checked={formData.publishRights === 'publish'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, publishRights: e.target.value as 'publish' | 'not-publish' }))}
                                    />
                                    <span className="label-text">เผยแพร่</span>
                                </label>
                                <label className="label cursor-pointer gap-2">
                                    <input 
                                        type="radio" 
                                        name="rights" 
                                        className="radio" 
                                        value="not-publish"
                                        checked={formData.publishRights === 'not-publish'}
                                        onChange={(e) => setFormData(prev => ({ ...prev, publishRights: e.target.value as 'publish' | 'not-publish' }))}
                                    />
                                    <span className="label-text">ไม่เผยแพร่</span>
                                </label>
                            </div>
                        </div>

                        {/* อัปโหลดไฟล์ */}
                        <div>
                            <label className="label">
                                <span className="label-text text-sm font-medium">อัปโหลดไฟล์บทความ</span>
                            </label>
                            <label className="w-full">
                                <div className="flex items-center gap-3 border border-base-300 rounded-xl p-3 hover:bg-base-200 cursor-pointer">
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            {formData.file ? formData.file.name : 'อัปโหลดไฟล์บทความ'}
                                        </p>
                                        <p className="text-xs opacity-60">รองรับ .pdf</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </label>
                        </div>

                        {/* ปุ่มบันทึก ยกเลิก */}
                        <div className="pt-4 flex flex-col md:flex-row gap-3 md:gap-6 md:justify-center">
                            <button 
                                type="submit" 
                                className="btn btn-success md:min-w-48 rounded-2xl text-base-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-error md:min-w-48 rounded-2xl text-base-100"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                ยกเลิก
                            </button>
                        </div>
                        
                    </form>

                </div>

            </div>
        </div>
    );
};

export default ArticleManagementPage;