class FileService
{
  constructor()
  {
    this.readFileAsBytes = this.readFileAsBytes.bind(this);
    this.dispatchSuccess = this.dispatchSuccess.bind(this);
    this.dispatchError = this.dispatchError.bind(this);
  }

  readFileAsBytes = (extras) =>
  {
    if(extras.file)
    {
      let reader = new FileReader();
      reader.readAsArrayBuffer(extras.file);
      reader.onload = (event) =>
      {
        let arrayBuffer = event.target.result;
        let data = new Uint8Array(arrayBuffer);
        this.dispatchSuccess(extras, data);
      };
      reader.onerror = (event) => {this.dispatchError(extras);};
    }
  }

  dispatchSuccess(extras, data)
  {
    extras.actionData = data;
    extras.actionSuccessful = true;
    extras.errorMessage = null;

    if (extras.successCallback)
      extras.successCallback(extras);
  }

  dispatchError(extras)
  {
    extras.actionSuccessful = false;
    extras.successMessage = null;

    if (extras.errorCallback)
      extras.errorCallback(extras);
  }
}

const fileService = new FileService();
