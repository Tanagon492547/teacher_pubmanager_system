import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

type alerts = {
  title?: string; 
  status?: string; 
  action_text?: string;
  error? : boolean,
};

// Variants สำหรับการเด้งเข้ามาของกล่องแจ้งเตือนทั้งหมด
const dropIn: Variants = {
  hidden: {
    y: '-100vh',
    opacity: 0,
    scale: 0.8
  },
  visible: {
    y: '0',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Variants สำหรับการปรากฏของแต่ละส่วนประกอบภายในกล่อง
const staggerItems: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1, // ทำให้แต่ละส่วนปรากฏไล่กัน
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
  },
};

const Notification = ({ title, status, action_text, error }: alerts) => {
  const router = useRouter();
  return (
    <div className="w-full h-full bg-black/50 fixed top-0 bottom-0 end-0 start-0 flex  flex-col justify-center items-center">
      <motion.div
        className="w-100 h-auto bg-white rounded-lg shadow-lg p-6 flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={staggerItems} initial="hidden" animate="visible" className='flex  flex-col justify-center items-center gap-5'>
          <motion.div variants={staggerItems} className="w-16 h-16 flex justify-center items-center rounded-xl bg-green-500 text-white text-2xl">
            <i className="fa-solid fa-lock"></i>
          </motion.div>

          <motion.p variants={staggerItems} className="mt-4 text-center font-bold text-lg text-xl">{title || 'ระบบบริหารจัดการผลงานตีพิมพ์'}</motion.p>
          {error? <motion.i variants={staggerItems} className="fa-solid fa-circle-xmark text-red-500 mt-2 text-7xl"></motion.i> : <motion.i variants={staggerItems} className="fa-solid fa-circle-check text-green-500 mt-2 text-7xl"></motion.i>}
          
          <motion.p variants={staggerItems} className="text-center text-sm text-gray-500 mt-2 text-9xl">{status || ''}</motion.p>

          <motion.button variants={staggerItems} className="btn btn-success mt-4" onClick={()=>router.replace('/usermanagement')}>Success</motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Notification;