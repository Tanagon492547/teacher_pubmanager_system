type ContributorCardProps = {
  article?: any;
};

const ContributorCard = ({ article }: ContributorCardProps) => {
  const contributorName = article?.contributor?.contributor_name || article?.contributor_name || 'ไม่ระบุเจ้าของบทความ';
  const contributorAcademic = article?.contributor?.academic_title || article?.contributor_academic_title || '';

  const coAuthors = Array.isArray(article?.coAuthors) ? article.coAuthors : [];

  return (
    <div className='w-full lg:w-[20%] flex flex-col gap-5'>
      <div className='flex flex-col gap-2 p-5  border-2 rounded-lg border-(--color-border)/20'>
        <p>เจ้าของบทความ</p>
        <div className='flex items-center gap-2'>
          <i className="fa-regular fa-face-smile text-4xl"></i>
          <p className='text-(--color-base-herder-content)/60'>
            {contributorAcademic ? `${contributorAcademic} ${contributorName}` : contributorName}
          </p>
        </div>
        {/* Optional fields from Personal / contributor can be rendered if available */}
        {article?.user_profile?.department && <p className='text-(--color-base-herder-content)/60'>{article.user_profile.department}</p>}
        {article?.user_profile?.faculty && <p className='text-(--color-base-herder-content)/60'>{article.user_profile.faculty}</p>}
        {article?.user_profile?.university && <p className='text-(--color-base-herder-content)/60'>{article.user_profile.university}</p>}
      </div>

      <div className='flex flex-col gap-2 p-5  border-2 rounded-lg border-(--color-border)/20'>
        <p>ผู้ร่วมบทความ</p>
        {coAuthors.length > 0 ? (
          <ul className='list-disc pl-5'>
            {coAuthors.map((c: any, idx: number) => (
              <li key={idx} className='mb-1'>
                <span className='font-medium'>{(c.academic_title || '').trim() || ''} </span>
                <span>{c.firstname} {c.lastname}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className='italic text-gray-400'>ไม่มีผู้ร่วมบทความ</div>
        )}
      </div>
    </div>
  );
};

export default ContributorCard;