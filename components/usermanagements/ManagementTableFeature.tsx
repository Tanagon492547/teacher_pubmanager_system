type user = {
  name: string | undefined,
  email: string | undefined,
  type: 'อาจารย์' | 'เจ้าหน้าที่' | 'Admin' | string | undefined,
  description: string | undefined,
  loginDate: string | undefined,
  key : number,
}

import Image from 'next/image';

const ManagementTableFeature = ({key,  name, email, type, description, loginDate }: user) => {
  const checkType = (type : 'อาจารย์' | 'เจ้าหน้าที่' | 'Admin' | string | undefined) =>{
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
    <tr key={key}>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12 relative">
              <Image
                src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                alt="Avatar Tailwind CSS Component"
                fill
                sizes="48px"
              />
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

      <td className="w-10 text-center"><button className={`btn btn-ghost rounded-xl`}><i className="fa-solid fa-pen text-(--color-warning)/80"></i></button></td>
      <td className="w-10 text-center"><button className={`btn btn-ghost rounded-xl `}><i className="fa-solid fa-trash text-(--color-error)"></i></button></td>
    
    </tr>

  );
}

export default ManagementTableFeature;