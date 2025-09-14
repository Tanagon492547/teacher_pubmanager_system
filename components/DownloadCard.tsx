type DownloadCardProps = { url?: string };
const DownloadCard =({url}: DownloadCardProps)=>{
  console.log(url)
  return (
    <button className={`btn btn-success btn-sm text-lg rounded-sm px-10 py-5 ${!url ? 'btn-disabled w-(--width-button-lock)' : ''}`}>
            {!url  ?  (<i className="fa-solid fa-lock"></i>) : ('Download PDF')}
    </button>
  )
}

export default DownloadCard;