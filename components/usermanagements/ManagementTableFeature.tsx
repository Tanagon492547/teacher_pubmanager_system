"use client"
import { useRouter } from 'next/navigation'

type user = {
  name: string | undefined,
  email: string | undefined,
  type: string | undefined,
  description: string | undefined,
  loginDate: string | undefined,
  id: number,
  
}

const ManagementTableFeature = ({ id, name, email, type, description, loginDate }: user) => {
  const router = useRouter()
  const checkType = (type : unknown) =>{
    if(type === 'อาจารย์'){
      return 'badge badge-soft badge-secondary';
    }else if(type === 'เจ้าหน้าที่'){
      return 'badge badge-soft badge-success';
    }else if(type === 'Admin'){
      return 'badge badge-soft badge-warning';
    }
    return 'badge badge-soft badge-primary';
  }
  return (
    <tr key={id}>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img
                src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
            <div className="text-sm opacity-50">{email}</div>
          </div>
        </div>
      </td>

      <td className="text-center">
        <div className={`${checkType(type)}`}>{type}</div>
      </td>

      <td className="text-center">
        <div>{description}</div>
      </td>

      <td className="text-center">
        <div>{loginDate}</div>
      </td>

      <td className="w-10 text-center">
        <button className={`btn btn-ghost rounded-xl`} onClick={() => router.push(`/usermanagement/${id}`)} title="แก้ไข">
          <i className="fa-solid fa-pen text-(--color-warning)/80"></i>
        </button>
      </td>
      <td className="w-10 text-center">
        <button className={`btn btn-ghost rounded-xl `} onClick={async () => {
          if (!confirm('ยืนยันการลบผู้ใช้นี้หรือไม่?')) return
          try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
            const json = await res.json()
            if (!res.ok) throw new Error(json?.error || 'Delete failed')
            // force a full page load to /usermanagement so parent (client) will re-fetch list
            try {
              // prefer a hard reload to ensure client useEffect runs and fetches updated data
              window.location.href = '/usermanagement'
            } catch (e) {
              // fallback to router navigation
              router.push('/usermanagement')
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            alert(message || 'ไม่สามารถลบได้')
          }
        }} title="ลบ">
          <i className="fa-solid fa-trash text-(--color-error)"></i>
        </button>
      </td>
    
    </tr>

  );
}

export default ManagementTableFeature;