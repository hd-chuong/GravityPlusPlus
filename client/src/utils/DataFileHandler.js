import path, { resolve } from 'path';
import {saveAs} from 'file-saver';
import {parse} from 'papaparse';
async function AsyncJSONUploadHandler(file) {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException('Problem parsing JSON file.'));
    };

    temporaryFileReader.onload = e => {
      resolve(JSON.parse(e.target.result));
    };

    temporaryFileReader.readAsText(file);
  });
}

async function AsyncCSVUploadHandler(file) {  
  return new Promise((resolve, reject) => {
    var result = parse(
      file, {
        header: true,
        complete: (results) => {
          console.log(results);
          resolve(results);
        },
        error: (err) => {
          console.log(err);
          reject(err);
        } 
    });
  })
  
};


export default async function AsyncDataFileHandler(file) {
  var data = null;
  var [extension] = path.basename(file.name).split('.').splice(-1);
  console.log(extension);
  try {
    switch (extension) {
      case 'csv':
        data = await AsyncCSVUploadHandler(file);
        break;
      case 'json':
        data = await AsyncJSONUploadHandler(file);
        break;
      case 'gpp':
        data = await AsyncJSONUploadHandler(file);
        break;
      default:
        alert('Unsupported data type. Currently support only CSV and JSON');
    }
  } catch (exception) {
    console.log(`File-reading error: ${exception}`);
  }
  return data;
}

export async function AsyncJSONDownloadHandler(filename, data)
{
  // pretty print node data
  let serializedValue = JSON.stringify(data);

  // Create a blob of the data
  let blobFile = new Blob([serializedValue], {
    type: "application/json",
    name: filename
  });
  saveAs(blobFile, filename);
}