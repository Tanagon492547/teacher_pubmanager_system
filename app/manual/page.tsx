// app/manual/page.tsx
"use client";

export default function ManualPage() {
  const handleClick = () => {
    alert("กดโหลดทำมายยย");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f6f6",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "min(100%, 600px)",
          background: "#dddddd",
          borderRadius: 18,
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>
          คู่มือการใช้งานระบบ
        </h1>
        <p style={{ marginBottom: "1.5rem" }}>ลิงก์</p>

        {/* ปุ่มดาวน์โหลด */}
        <button
          onClick={handleClick}
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ดาวน์โหลด
        </button>
      </div>
    </main>
  );
}
