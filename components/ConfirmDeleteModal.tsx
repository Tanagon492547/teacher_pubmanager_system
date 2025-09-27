"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Props ที่ Component นี้ต้องการ
type Props = {
  isOpen: boolean; // State บอกว่าให้เปิดหรือปิด
  onClose: () => void; // ฟังก์ชันที่จะทำงานเมื่อกด "ยกเลิก"
  onConfirm: () => void; // ฟังก์ชันที่จะทำงานเมื่อกด "ยืนยัน"
  title: string; // หัวข้อของ Modal
  message: string; // ข้อความคำถาม
};

const ConfirmDeleteModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    // AnimatePresence จะจัดการ Animation ตอนที่ Modal หายไป
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="mt-4 text-gray-600">{message}</p>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={onClose} className="btn btn-ghost">
                ยกเลิก
              </button>
              <button onClick={onConfirm} className="btn btn-error text-white">
                ยืนยันการลบ
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
