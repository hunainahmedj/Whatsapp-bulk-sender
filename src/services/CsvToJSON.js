export const documentPick = async () => {
    try {
      const resource = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.video,
          DocumentPicker.types.pdf,
          DocumentPicker.types.csv,
          DocumentPicker.types.plainText,
        ], // Multiple type strings are not supported on Android before KitKat (API level 19), Jellybean will fall back to */* if you provide an array with more than one value.
      });
      let RNFS = require('react-native-fs');
      let url = resource.uri;
      console.log(url);
      const split = url.split('/');
      const name = split.pop();
      const inbox = split.pop();
      const realPath = `${RNFS.TemporaryDirectoryPath}${inbox}/${name}`;
      RNFS.readFile(url).then(data => {
        console.log(data);
        convertToJson(data);
        // csvJSON(data);
      });
      // console.log(realPath);
      // setDocument(resource);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };