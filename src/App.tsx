
import { ChangeEvent, useEffect, useState } from 'react';
import './App.css'

function App() {
  interface Dimensions{
    width: string;
    height: string;
  }
  const [name , setname] = useState<string>('')
  const [fileChosen, setFileChosen] = useState<boolean>(false);
  const [isFile , setisFile] = useState<boolean>(false);
  const [New, setNew] = useState<Dimensions>({
    width: 'xxxx',
    height: 'xxxx',
  });
  const [Old, setOld] = useState<Dimensions>({
    width: 'xxxx',
    height: 'xxxx',
  });
  const [size , setSize] = useState<string>('null')
  const [Newsize , setNewSize] = useState<string>('null')
  const [uploadedfile ,setFile] = useState<any>(null)
  function calculateNewImageSize(oldSize: Dimensions, newSize: Dimensions, oldSizeInBytes: string): number {
    // Calculate the conversion factors for width and height
    const widthConversionFactor = parseInt(newSize.width) / parseInt(oldSize.width);
    const heightConversionFactor = parseInt(newSize.height) / parseInt(oldSize.height);
  
    // Use the average conversion factor
    const averageConversionFactor = (widthConversionFactor + heightConversionFactor) / 2;
  
    // Estimate the new size based on the average conversion factor
    const newSizeInBytes = Math.round(extractBytesFromString(oldSizeInBytes) * averageConversionFactor);
  
    return newSizeInBytes *1.5;
  }
  function extractBytesFromString(sizeString: string): number {
    // Regular expression to match numeric value and unit (e.g., "568KB")
    const regex = /^(\d+(\.\d+)?)\s*(KB|MB|GB)?$/i;
    const match = sizeString.match(regex);
  
    if (match) {
      const numericValue = parseFloat(match[1]);
      const unit = match[3]?.toUpperCase() || 'B'; // Default to bytes if no unit is specified
  
      switch (unit) {
        case 'KB':
          return numericValue * 1024;
        case 'MB':
          return numericValue * 1024 * 1024;
        case 'GB':
          return numericValue * 1024 * 1024 * 1024;
        case 'B':
          return numericValue;
        default:
          return 0; // Invalid unit
      }
    }
  
    return 0; // No match found
  }
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
      const file = event.target.files[0]
      if (!File(file)){
          DeleteData;
          
          ipcRenderer.send('Not-an-Image')
        return ;
      }
      setFileChosen(true);
      setisFile(true)
      setSize(formatBytes(file['size']))
      setname(file['name'])
      const image : any = new Image()
      image.src = URL.createObjectURL(file)
      console.log(image);
      image.onload = function (){
        setOld({
          width:this.width , 
          height : this.height ,
        })
        setNew({
          width:this.width , 
          height : this.height ,

        })
      }
      } else {
      setFileChosen(false);
    }
    
  };
  function DeleteData() {
    setFileChosen(false)
    setFile(null)
    setisFile(false)
    setNew({
      width:'xxxx', 
      height : 'xxxx' ,

    })
    setOld({
      width:'xxxx', 
      height : 'xxxx' ,

    })
    setSize('null')
  }
  const resizeimage = (event :  React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    if ( !New.width|| !New.height ) {
      ipcRenderer.send('Fill-Inputs')
    return ;
  }
  setFileChosen(false)
  setFile(null)
  setisFile(false)
  setNew({
    width:'xxxx', 
    height : 'xxxx' ,

  })
  setOld({
    width:'xxxx', 
    height : 'xxxx' ,

  })
  setSize('null')
  if ( !uploadedfile) {
        ipcRenderer.send('Not-an-Image')
      return ;
    }
    const imgPath = uploadedfile['path']
    const width = New.width 
    const height = New.height
    ipcRenderer.send('Image-Resize',{
      imgPath,
      height,
      width
        })
  }
  const updatewidth = (event : ChangeEvent<HTMLInputElement>) => {
    setNew({
      ...New, // Spread the existing properties
      width: event.target.value, // Update specific property
    });
    
  };
  const updateheight = (event : ChangeEvent<HTMLInputElement>) => {
    setNew({
      ...New, // Spread the existing properties
      height: event.target.value, // Update specific property
    });
  };


  useEffect(()=>{
    setNewSize(formatBytes(calculateNewImageSize(Old , New , size)))
  },[New ,fileChosen])


  const outputPath = path.join(os.homedir(),'imageresizer')
  const containerClass = fileChosen && isFile ? 'grid grid-rows-[20%_45%_5%_30%]':'grid grid-rows-[20%_50%_30%]'

  const File = (file : any) =>{
    const accepetedImages :string[] = ['image/gif ', 'image/png' , 'image/jpeg', 'image/jpg' ]
    return file && accepetedImages.includes(file['type'])
  }
  console.log(Newsize);
  
  return (
    <main>
    <div className='grid grid-rows-2 gap-0 p-5 z-0 bg-background text-white font-roboto'>
      <div className={containerClass}>
        <div className= 'grid grid-cols-[1fr_4fr_1fr] justify-end'>
          <div className='centered'>  
          </div>
          <div className='centered flex-shrink-0 gap-0 mt-3 w-fit h-fit'>
          <svg width="381" height="40" viewBox="0 0 121 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.63086 11.5098V18.3457C3.63086 18.8014 3.47135 19.1888 3.15234 19.5078C2.83333 19.8268 2.45052 19.9863 2.00391 19.9863C1.54818 19.9863 1.16081 19.8268 0.841797 19.5078C0.522786 19.1888 0.363281 18.8014 0.363281 18.3457V1.95312C0.372396 1.48828 0.531901 1.10547 0.841797 0.804688C1.16081 0.494792 1.54818 0.330729 2.00391 0.3125H12.2441C14.4316 0.376302 16.0267 1.26042 17.0293 2.96484C17.5488 3.84896 17.8086 4.80143 17.8086 5.82227C17.8086 6.20508 17.7721 6.59245 17.6992 6.98438C17.4258 8.48828 16.7285 9.65039 15.6074 10.4707C14.7324 11.0905 13.6751 11.4323 12.4355 11.4961L15.9355 17.5391C16.0723 17.8034 16.1406 18.0768 16.1406 18.3594C16.1406 18.4961 16.127 18.6374 16.0996 18.7832C15.9811 19.2207 15.7214 19.5488 15.3203 19.7676C15.0651 19.9225 14.8008 20 14.5273 20C14.3815 20 14.2311 19.9772 14.0762 19.9316C13.6387 19.8223 13.3105 19.5716 13.0918 19.1797L8.66211 11.5098H3.63086ZM3.63086 8.22852H12.2441C13.3379 8.2194 14.0488 7.75 14.377 6.82031C14.4772 6.52865 14.5273 6.23242 14.5273 5.93164C14.5273 5.57617 14.4544 5.21615 14.3086 4.85156C14.0169 4.1224 13.5247 3.7168 12.832 3.63477L12.2441 3.59375H3.63086V8.22852ZM21.6367 20C21.1081 20 20.6797 19.8359 20.3516 19.5078C20.0234 19.1615 19.8594 18.7285 19.8594 18.209V1.99414C19.9688 1.25586 20.3014 0.740885 20.8574 0.449219C21.0306 0.367188 21.2812 0.326172 21.6094 0.326172H33.791C34.2376 0.326172 34.6204 0.490234 34.9395 0.818359C35.2585 1.13737 35.418 1.52018 35.418 1.9668C35.418 2.42253 35.2585 2.8099 34.9395 3.12891C34.6204 3.44792 34.2376 3.60742 33.791 3.60742H23.1406V8.24219H30.9883C31.444 8.24219 31.8314 8.40169 32.1504 8.7207C32.4694 9.03971 32.6289 9.42708 32.6289 9.88281C32.6289 10.3385 32.4694 10.7214 32.1504 11.0312C31.8314 11.3594 31.444 11.5234 30.9883 11.5234H23.1406V16.7188H33.791C34.2376 16.7188 34.6204 16.8737 34.9395 17.1836C35.2585 17.5117 35.418 17.9036 35.418 18.3594C35.418 18.8151 35.2585 19.2025 34.9395 19.5215C34.6204 19.8405 34.2376 20 33.791 20H21.6367ZM52.2754 0.3125C52.804 0.3125 53.2233 0.476562 53.5332 0.804688C53.8522 1.13281 54.0117 1.55208 54.0117 2.0625C54.0117 2.41797 53.9342 2.72786 53.7793 2.99219C53.4876 3.54818 52.9863 3.82617 52.2754 3.82617H42.5957C41.9395 3.82617 41.388 4.04492 40.9414 4.48242C40.4948 4.91081 40.2715 5.45312 40.2715 6.10938C40.2715 6.76562 40.4948 7.3125 40.9414 7.75C41.388 8.1875 41.9395 8.40625 42.5957 8.40625H49.9238C51.5189 8.41536 52.877 8.98958 53.998 10.1289C55.11 11.25 55.666 12.6035 55.666 14.1895C55.666 15.5931 55.151 16.901 54.1211 18.1133C53.0547 19.3711 51.8197 20 50.416 20H38.5488C38.0202 20 37.5964 19.8359 37.2773 19.5078C36.9583 19.1888 36.7988 18.765 36.7988 18.2363C36.7988 17.8991 36.8763 17.5892 37.0312 17.3066C37.332 16.7507 37.8379 16.4727 38.5488 16.4727H50.0195C50.612 16.4727 51.1224 16.2448 51.5508 15.7891C51.9701 15.3333 52.1797 14.8001 52.1797 14.1895C52.1797 13.5423 51.9564 13.0046 51.5098 12.5762C51.0814 12.1387 50.5436 11.9199 49.8965 11.9199H42.5957C40.9824 11.9199 39.6152 11.3503 38.4941 10.2109C37.3548 9.08984 36.7852 7.72266 36.7852 6.10938C36.7852 4.50521 37.3548 3.13802 38.4941 2.00781C39.6152 0.877604 40.9824 0.3125 42.5957 0.3125H52.2754ZM60.998 18.3594C60.998 18.806 60.8385 19.1888 60.5195 19.5078C60.2005 19.8359 59.8132 20 59.3574 20C58.9108 20 58.528 19.8359 58.209 19.5078C57.89 19.1888 57.7305 18.806 57.7305 18.3594V1.93945C57.7305 1.49284 57.89 1.11003 58.209 0.791016C58.528 0.462891 58.9108 0.298828 59.3574 0.298828C59.8132 0.298828 60.2005 0.462891 60.5195 0.791016C60.8385 1.11003 60.998 1.49284 60.998 1.93945V18.3594ZM81.0957 0.326172C81.834 0.353516 82.3398 0.690755 82.6133 1.33789C82.6953 1.53841 82.7363 1.73438 82.7363 1.92578C82.7363 2.40885 82.4993 2.88737 82.0254 3.36133L74.0684 11.3184L68.6543 16.7188H81.0957C81.5514 16.7188 81.9388 16.8737 82.2578 17.1836C82.5768 17.5117 82.7363 17.9036 82.7363 18.3594C82.7363 18.806 82.5768 19.1934 82.2578 19.5215C81.9388 19.8405 81.5514 20 81.0957 20H64.9492C64.3568 20 63.8874 19.8223 63.541 19.4668C63.2311 19.1478 63.0762 18.7513 63.0762 18.2773C63.0762 18.1953 63.0807 18.1178 63.0898 18.0449C63.1263 17.7441 63.3633 17.3841 63.8008 16.9648L71.7578 8.98047L77.1445 3.60742H64.7031C64.2565 3.60742 63.8737 3.44792 63.5547 3.12891C63.2266 2.8099 63.0625 2.42253 63.0625 1.9668C63.0625 1.52018 63.2266 1.13737 63.5547 0.818359C63.8737 0.490234 64.2565 0.326172 64.7031 0.326172H81.0957ZM86.5781 20C86.0495 20 85.6211 19.8359 85.293 19.5078C84.9648 19.1615 84.8008 18.7285 84.8008 18.209V1.99414C84.9102 1.25586 85.2428 0.740885 85.7988 0.449219C85.972 0.367188 86.2227 0.326172 86.5508 0.326172H98.7324C99.179 0.326172 99.5618 0.490234 99.8809 0.818359C100.2 1.13737 100.359 1.52018 100.359 1.9668C100.359 2.42253 100.2 2.8099 99.8809 3.12891C99.5618 3.44792 99.179 3.60742 98.7324 3.60742H88.082V8.24219H95.9297C96.3854 8.24219 96.7728 8.40169 97.0918 8.7207C97.4108 9.03971 97.5703 9.42708 97.5703 9.88281C97.5703 10.3385 97.4108 10.7214 97.0918 11.0312C96.7728 11.3594 96.3854 11.5234 95.9297 11.5234H88.082V16.7188H98.7324C99.179 16.7188 99.5618 16.8737 99.8809 17.1836C100.2 17.5117 100.359 17.9036 100.359 18.3594C100.359 18.8151 100.2 19.2025 99.8809 19.5215C99.5618 19.8405 99.179 20 98.7324 20H86.5781Z" fill="white"/>
                <path d="M111.01 7.83203L118.051 0.818359C118.361 0.490234 118.748 0.326172 119.213 0.326172C119.66 0.326172 120.042 0.490234 120.361 0.818359C120.689 1.13737 120.854 1.52018 120.854 1.9668C120.854 2.42253 120.689 2.8099 120.361 3.12891L113.334 10.1699L120.361 17.1836C120.689 17.5117 120.854 17.9036 120.854 18.3594C120.854 18.806 120.689 19.1934 120.361 19.5215C120.042 19.8405 119.66 20 119.213 20C118.748 20 118.361 19.8405 118.051 19.5215L111.01 12.4805L103.969 19.5215C103.65 19.8405 103.267 20 102.82 20C102.365 20 101.977 19.8405 101.658 19.5215C101.339 19.1934 101.18 18.806 101.18 18.3594C101.18 17.9036 101.339 17.5117 101.658 17.1836L108.699 10.1699L101.658 3.12891C101.339 2.8099 101.18 2.42253 101.18 1.9668C101.18 1.52018 101.339 1.13737 101.658 0.818359C101.977 0.490234 102.365 0.326172 102.82 0.326172C103.267 0.326172 103.65 0.490234 103.969 0.818359L111.01 7.83203Z" fill="#07C3F2"/>
          </svg>

          </div>
          <div className='centered '>
          </div>
        </div>
        <div className=' relative bg-drag rounded-lg border-dashed border-[1.8px] border-gray-500 '>
          <input type="file" onChange={handleFileChange}  disabled={fileChosen && isFile} className=' relative z-10 top-0 left-0 w-full h-full opacity-0 cursor-pointer'/>  
          { !fileChosen && <div>
           <div className=' absolute z-1 top-[9%] left-5 pt-5'>
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 143.08">
               <path d="M32.5 11.5976C31.68 11.591 30.9733 11.9986 30.68 12.3763L26.1183 18.1039C25.835 18.4485 25.2017 18.2249 24.9067 18.0542L20.815 15.4911C20.3317 15.1763 19.7817 14.9112 19.1683 14.9112C18.535 14.9112 17.8583 15.1001 17.3817 15.6303L11.8933 21.8002C11.1517 22.6253 12.3933 23.7321 13.1367 22.907L18.6267 16.737C18.99 16.3493 19.5183 16.6542 19.9017 16.8762L24.0017 19.4476L24.0217 19.4575C24.5317 19.7723 25.105 19.875 25.6683 19.8817C26.235 19.8883 26.8517 19.8369 27.31 19.2852L31.9217 13.4864C32.2833 13.0507 32.8117 13.2544 33.1617 13.5527L36.9183 16.3493C37.7967 17.1396 38.9267 15.728 37.9517 15.057L34.1983 12.257C33.7533 11.9091 33.1883 11.5976 32.5 11.5976ZM12.5 24.8521H37.5C37.9617 24.8521 38.3333 25.2215 38.3333 25.6805C38.3333 26.1394 37.9617 26.5089 37.5 26.5089H12.5C12.0383 26.5089 11.6667 26.1394 11.6667 25.6805C11.6667 25.2215 12.0383 24.8521 12.5 24.8521ZM18.3333 4.97041C16.5 4.97041 15 6.46154 15 8.28402C15 10.1065 16.5 11.5976 18.3333 11.5976C20.1667 11.5976 21.6667 10.1065 21.6667 8.28402C21.6667 6.46154 20.1667 4.97041 18.3333 4.97041ZM18.3333 6.62722C19.2633 6.62722 20 7.35953 20 8.28402C20 9.20852 19.2633 9.94083 18.3333 9.94083C17.4033 9.94083 16.6667 9.20852 16.6667 8.28402C16.6667 7.35953 17.4033 6.62722 18.3333 6.62722ZM41.6667 38.9349C41.6667 39.1546 41.5789 39.3653 41.4226 39.5207C41.2663 39.676 41.0543 39.7633 40.8333 39.7633C40.6123 39.7633 40.4004 39.676 40.2441 39.5207C40.0878 39.3653 40 39.1546 40 38.9349C40 38.7152 40.0878 38.5045 40.2441 38.3491C40.4004 38.1938 40.6123 38.1065 40.8333 38.1065C41.0543 38.1065 41.2663 38.1938 41.4226 38.3491C41.5789 38.5045 41.6667 38.7152 41.6667 38.9349ZM10 38.9349C10 39.1546 9.9122 39.3653 9.75592 39.5207C9.59964 39.676 9.38768 39.7633 9.16667 39.7633C8.94565 39.7633 8.73369 39.676 8.57741 39.5207C8.42113 39.3653 8.33333 39.1546 8.33333 38.9349C8.33333 38.7152 8.42113 38.5045 8.57741 38.3491C8.73369 38.1938 8.94565 38.1065 9.16667 38.1065C9.38768 38.1065 9.59964 38.1938 9.75592 38.3491C9.9122 38.5045 10 38.7152 10 38.9349ZM25 36.4497C23.1667 36.4497 21.6667 37.9408 21.6667 39.7633C21.6667 41.5858 23.1667 43.0769 25 43.0769C26.8333 43.0769 28.3333 41.5858 28.3333 39.7633C28.3333 37.9408 26.8333 36.4497 25 36.4497ZM25 38.1065C25.9383 38.1065 26.6667 38.8305 26.6667 39.7633C26.6667 40.6961 25.9383 41.4201 25 41.4201C24.0617 41.4201 23.3333 40.6961 23.3333 39.7633C23.3333 38.8305 24.0617 38.1065 25 38.1065ZM44.1667 1.6568C43.0583 1.6568 43.0867 3.31361 44.1667 3.31361H47.5C47.9767 3.31361 48.3333 3.66817 48.3333 4.14201V27.3373C48.3333 27.8111 47.9767 28.1657 47.5 28.1657H44.1667C43.0767 28.1657 43.0667 29.8225 44.1667 29.8225H47.5C48.87 29.8225 50 28.6992 50 27.3373V4.14201C50 2.78012 48.87 1.6568 47.5 1.6568H44.1667ZM2.5 1.6568C1.13 1.6568 0 2.78012 0 4.14201V27.3373C0 28.6992 1.13 29.8225 2.5 29.8225H5.83333C6.93333 29.8225 6.94167 28.1657 5.83333 28.1657H2.5C2.02333 28.1657 1.66667 27.8111 1.66667 27.3373V4.14201C1.66667 3.66817 2.02333 3.31361 2.5 3.31361H5.83333C6.93333 3.31361 6.93333 1.6568 5.83333 1.6568H2.5ZM10.8333 0C9.46333 0 8.33333 1.12331 8.33333 2.48521V28.9941C8.33333 30.356 9.46333 31.4793 10.8333 31.4793H39.1667C40.5367 31.4793 41.6667 30.356 41.6667 28.9941V2.48521C41.6667 1.12331 40.5367 0 39.1667 0H10.8333ZM10.8333 1.6568H39.1667C39.6433 1.6568 40 2.01136 40 2.48521V28.9941C40 29.4679 39.6433 29.8225 39.1667 29.8225H10.8333C10.3567 29.8225 10 29.4679 10 28.9941V2.48521C10 2.01136 10.3567 1.6568 10.8333 1.6568Z" fill="#606060"/>
          </svg>
          </div> 
          <div className=' absolute z-5 top-20 left-[36.5%] w-fit h-fit opacity-25 pt-5'>
            Drag & Drop an image
           </div>
           <div className=' absolute z-5 top-[55%] left-[29.5%] w-fit h-fit opacity-25 pt-5'>
            or
           </div>
           <div className=' absolute z-5 top-[55%] left-[33%] w-fit h-fit text-button pt-5'>
           Click to Browse on your device
           </div>
           </div> 
          }
          {fileChosen && isFile &&
          <div>
            <div className=' absolute z-1 top-[-20%] left-3 pt-3'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7071 6.29289C20.0976 6.68342 20.0976 7.31658 19.7071 7.70711L10.4142 17C9.63316 17.7811 8.36683 17.781 7.58579 17L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L18.2929 6.29289C18.6834 5.90237 19.3166 5.90237 19.7071 6.29289Z" fill="#008085"></path> </g></svg>
            </div>
            <div className=' absolute z-5 top-[52%] left-[28.5%] w-fit h-fit opacity-25 pt-5 '>
              {name} is uploaded
            </div>

           
           
          </div>
          }
        
          
        </div>   
        {fileChosen && isFile && 
        <div className='centered opacity-95 pt-5  text-teal-500 hover:cursor-pointer hover:underline' onClick={DeleteData}
            >
              Reset
            </div>} 
        <div className='grid grid-rows-2 w-full '>
          <div className='flex items-end  w-full'>Output directory</div>
          <div className=  'grid grid-cols-[9fr_1fr] bg-drag w-full rounded-xl h-4/5 over:cursor-pointer' >
            <div className='flex justify-start mt-3 px-3'> {outputPath}</div>
            <div className='flex justify-center mt-3 ml-3'>
             <svg width="12" height="12" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.032 9.43201L8.8 9.67201V7.60001C8.8 7.38783 8.71571 7.18435 8.56569 7.03432C8.41566 6.88429 8.21217 6.80001 8 6.80001C7.78783 6.80001 7.58434 6.88429 7.43431 7.03432C7.28429 7.18435 7.2 7.38783 7.2 7.60001V9.67201L6.968 9.43201C6.81736 9.28136 6.61304 9.19673 6.4 9.19673C6.18696 9.19673 5.98264 9.28136 5.832 9.43201C5.68136 9.58265 5.59673 9.78697 5.59673 10C5.59673 10.213 5.68136 10.4174 5.832 10.568L7.432 12.168C7.50808 12.2408 7.5978 12.2979 7.696 12.336C7.79176 12.3783 7.8953 12.4002 8 12.4002C8.1047 12.4002 8.20824 12.3783 8.304 12.336C8.4022 12.2979 8.49192 12.2408 8.568 12.168L10.168 10.568C10.3186 10.4174 10.4033 10.213 10.4033 10C10.4033 9.78697 10.3186 9.58265 10.168 9.43201C10.0174 9.28136 9.81304 9.19673 9.6 9.19673C9.38696 9.19673 9.18264 9.28136 9.032 9.43201ZM13.6 2.80001H8.576L8.32 2.00001C8.15404 1.53059 7.8462 1.12441 7.43912 0.837737C7.03204 0.551063 6.54589 0.398089 6.048 0.400008H2.4C1.76348 0.400008 1.15303 0.652864 0.702944 1.10295C0.252856 1.55304 0 2.16349 0 2.80001V13.2C0 13.8365 0.252856 14.447 0.702944 14.8971C1.15303 15.3472 1.76348 15.6 2.4 15.6H13.6C14.2365 15.6 14.847 15.3472 15.2971 14.8971C15.7471 14.447 16 13.8365 16 13.2V5.20001C16 4.56349 15.7471 3.95304 15.2971 3.50295C14.847 3.05286 14.2365 2.80001 13.6 2.80001ZM14.4 13.2C14.4 13.4122 14.3157 13.6157 14.1657 13.7657C14.0157 13.9157 13.8122 14 13.6 14H2.4C2.18783 14 1.98434 13.9157 1.83431 13.7657C1.68429 13.6157 1.6 13.4122 1.6 13.2V2.80001C1.6 2.58783 1.68429 2.38435 1.83431 2.23432C1.98434 2.08429 2.18783 2.00001 2.4 2.00001H6.048C6.21572 1.99958 6.37932 2.05186 6.5157 2.14948C6.65208 2.2471 6.75433 2.38511 6.808 2.54401L7.24 3.85601C7.29367 4.0149 7.39592 4.15292 7.5323 4.25053C7.66868 4.34815 7.83228 4.40044 8 4.40001H13.6C13.8122 4.40001 14.0157 4.48429 14.1657 4.63432C14.3157 4.78435 14.4 4.98783 14.4 5.20001V13.2Z" fill="#A0A0A0"/>
              </svg>
          </div>

          </div>
        </div>
      </div>
      <form onSubmit={resizeimage} className='grid grid-rows-[1fr_2fr_1fr] font-semibold gap-5'>
        <div className='grid grid-cols-2 gap-0'>
        <div className='grid grid-rows-2 gap-2 w-full'>
          <div className='flex items-end  w-full ' >Width</div>
          <input type='text' onChange={updatewidth} className='bg-drag p-4  rounded-xl border-solid border-[1.2px] border-border h-full w-[95%] placeholder:font-medium placeholder:opacity-90 ' placeholder={Old.width} />
        </div>
        <div className='grid grid-rows-2 gap-2  w-full'>
          <div className='flex items-end  w-full'>Height</div>
          <input type='text' onChange={updateheight}  className='bg-drag p-4  rounded-xl border-solid border-[1.2px] border-border h-full w-[95%] placeholder:font-medium placeholder:opacity-90  ' placeholder={Old.height} />
          
        </div>
        </div>
        <div className='grid grid-cols-2  gap-0'>
        <div className='grid grid-rows-[1fr_4fr] gap-1 items-start  w-full'>
          <div className='flex items-end  w-full'>Before</div>
          <div className='bg-drag rounded-xl border-solid border-[1.2px] border-border h-[90%] w-[95%]'>
          <div className='grid p-3 grid-rows-2 gap-2 '>
                <div className=' grid grid-rows-2 gap-0 font-medium'>
                  <div className='flex '>dimension</div>
                  <div className='flex items-start opacity-30 text-sm'>{`${Old.width}*${Old.height}`}</div>
                </div>

                <div className=' grid grid-rows-2 gap-0 font-medium'>
                  <div className='flex '>size</div>
                  <div className='flex items-start opacity-30 text-sm'>{size}</div>
                </div>
              </div>
          </div>
          
        </div>
        <div className='grid grid-rows-[1fr_4fr] gap-1 w-full'>
          <div className='flex items-end   w-full'>After</div>
          <div className='bg-drag rounded-xl border-solid border-[1.2px] border-border h-[90%] w-[95%]'>
              <div className='grid p-3 grid-rows-2 gap-2 '>
                <div className=' grid grid-rows-2 gap-0 font-medium'>
                  <div className='flex '>dimension</div>
                  <div className='flex items-start opacity-30 text-sm'>{`${New.width}*${New.height}`}</div>
                </div>

                <div className=' grid grid-rows-2 gap-0 font-medium'>
                  <div className='flex '>size</div>
                  <div className='flex items-start opacity-30 text-sm'>{Newsize === 'NaN undefined' ? 'null': Newsize}</div>
                </div>
              </div>
              
          </div>
        </div>
        </div>
        <div className='centered '>
          <button  type='submit' className='w-4/5 h-4/5 pt-3 bg-button hover:cursor-pointer hover:appearance-none'> Resize and Save</button>
        </div>

      </form>
    </div>
    </main>
  )
}

export default App
