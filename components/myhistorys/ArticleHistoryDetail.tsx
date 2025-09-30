import React from 'react';

interface StatusHistoryItem {
  status: string;
  date: string;
  reviewer: string;
  note: string;
}

interface ArticleHistoryDetailProps {
  title: string;
  author: string;
  statusHistory: StatusHistoryItem[];
  onClose: () => void;
}

const ArticleHistoryDetail: React.FC<ArticleHistoryDetailProps> = ({
  title,
  author,
  statusHistory,
  onClose,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'รอตรวจ':
      case 'กำลังตรวจ':
        return 'text-yellow-600 bg-yellow-100';
      case 'ต้องแก้ไข':
        return 'text-red-600 bg-red-100';
      case 'ข้อมูลสมบูรณ์':
      case 'เสร็จสิ้น':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">ผู้เขียน: {author}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">ประวัติการดำเนินการ</h3>
          
          <div className="space-y-4">
            {statusHistory.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">ผู้ดำเนินการ:</span> {item.reviewer}
                    </div>

                    {item.note && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-700 mb-1">หมายเหตุ:</p>
                        <p className="text-sm text-gray-600">{item.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {statusHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีประวัติการดำเนินการ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleHistoryDetail;
