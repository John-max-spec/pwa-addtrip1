import Dexie from "dexie";
import {useLiveQuery} from "dexie-react-hooks";


export const db = new Dexie("todo-photos"); 
db.version(1).stores({ 
 photos: "id",  
 
});
async function addPhoto(id, imgSrc) { 
 console.log("addPhoto", imgSrc.length, id);
 try {
 

 const i = await db.photos.add({
 id: id, 
 imgSrc: imgSrc, 
 });
 console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
 } catch (error) {
 console.log(`Failed to add photo: ${error}`);
 }
 return (
 <>
 <p>
 {imgSrc.length} &nbsp; | &nbsp; {id}
 </p>
 </>
 );
}
function GetPhotoSrc(id) {
 console.log("getPhotoSrc", id);
 const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
 console.table(img);
 if (Array.isArray(img)) return img[0].imgSrc;  
} 
export { addPhoto, GetPhotoSrc };
