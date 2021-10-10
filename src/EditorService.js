class EditorService
{
  constructor()
  {
    this.trackLaps = {};
    this.selectedTrack = null;
  }

  onCloneROM = () =>
  {
    let f = document.getElementById("file").files[0];
    let extras = {};
    extras.successCallback = this.onStoreROM;
    extras.errorCallback = this.showErrorMessage;
    extras.errorMessage = "Error reading the files!";
    extras.successMessage = "ROM Cloned!";
    extras.file = f;
    fileService.readFileAsBytes(extras);
  }

  onStoreROM = (extras) =>
  {
    try
    {
      let rom = {"tg": extras.actionData};
      romService.setROM(rom, "tg", this.getLapBytes());
      this.getLapValues();
      this.showMessage(extras);
    }
    catch(e)
    {
      this.showErrorMessage(e, null);
    }
  }

  applyTrackLaps = () =>
  {
    let ci;
    let v;
    let index = romService.indexOfBytes("tg",
        this.getLapBytes(), "hex", 0) - 64;

    Object.keys(this.trackLaps).forEach((key) =>
    {
      ci = parseInt(key, 10);
      v = this.trackLaps[key];

      if(!isNaN(ci) && !isNaN(v) && v > 0 && v < 10)
        romService.setByte("tg", index + ci, v);
    });
  }

  applyTitleScreenText = () =>
  {
    let bytes = this.getTitleScreeTextBytes();
    bytes = bytes.map((byte) => parseInt(byte, 16));
    let index = romService.indexOfBytes("tg",
        this.getOriginalTitleScreenTextBytes(), "hex", 0);
    index = index > -1 ? index : 503754;
    console.log(index);
    console.log(romService.indexOfBytes("tg",
    this.getOriginalTitleScreenTextBytes(), "hex", 0));
    romService.setBytes("tg", index, bytes);
  }

  generateROM = () =>
  {
    this.applyTrackLaps();
    this.applyTitleScreenText();
    let rom = romService.getROM()["tg"];
    let name = "topgear_hack.smc";
    let contentType = "application/octet-stream";
    this.downloadFile(rom, name, contentType);
  }

  downloadFile = (content, filename, contentType) =>
  {
    let data = content instanceof Blob ? content :
        new Blob([content], {type: contentType});
    let a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(data)
    a.dataset.downloadurl =
        [contentType, a.download, a.href].join(':');
    a.click();
  }

  onTrackSelected = (event) =>
  {
    let ti = document.getElementById("trackInfo");

    if(this.isValidTrack(event.value))
    {
      this.selectedTrack = event.value;
      let tf = document.getElementById("lapAmount");
      tf.value = this.trackLaps[this.selectedTrack];
      let maxLaps = lapData[this.selectedTrack].maxLaps;

      if(maxLaps < 10)
      {
        let info = "Some cars will not be able to finish " ;
        info += " this track if it has more than " + maxLaps;
        info += " laps."
        ti.innerHTML = info;
      }
      else
        ti.innerHTML = "";
    }
    else
    {
      ti.innerHTML = "";
      this.selectedTrack = null;
    }
  }

  onLapChanged = (event) =>
  {
    if(this.isValidTrack(this.selectedTrack))
    {
      let v = parseInt(event.value);

      if(!isNaN(v) || v > -1 && v < 11)
        this.trackLaps[this.selectedTrack] = v;
    }
  }

  isValidTrack = (track) =>
  {
    let v = parseInt(track);
    return (v > - 1 && v < 63) && v % 2 == 0;
  }

  showErrorMessage = (error, message) =>
  {
    console.log(error);
    console.log(error.message);
    let me = document.getElementById("message");
    me.innerHTML = message ? message : error.message;
    me.className = "errorMessage";
    setTimeout(() => {this.showMessage({});}, 5000);
  }

  showMessage = (extras) =>
  {
    let msg = extras ? extras.successMessage : null;
    msg = msg ? msg : "";
    let me = document.getElementById("message");
    me.innerHTML = msg;
    me.className = "message";
    setTimeout(() => {this.showMessage({});}, 5000);
  }

  getLapValues = () =>
  {
    let index = romService.indexOfBytes("tg",
        this.getLapBytes(), "hex", 0) - 64;
    let bytes = romService.getBytes("tg", index, 64);
    let i;

    for(i = 0; i < bytes.length; i += 2)
      this.trackLaps[i.toString()] = bytes[i];
  }

  populateTrackSelect = () =>
  {
    let i;
    let s = document.getElementById("trackSelect");

    Object.keys(lapData).forEach((key) =>
    {
      i = lapData[key];
      s.options[s.options.length] = new Option(i.label, key);
    });
  }

  getLapBytes = () =>
  {
    return ["98", "8F", "98", "0F", "98", "0F"];
  }

  getTitleScreeTextBytes = () =>
  {
    return [
      "47", "49", "54", "48", "55", "42", "68", "43",
      "4F", "4D", "31", "47", "41", "4D", "45", "48",
      "41", "43", "4B", "46", "41", "4E", "31", "54",
      "47", "45", "20"
    ];
  }

  getOriginalTitleScreenTextBytes = () =>
  {
    return [
      "3F", "20", "31", "39", "39", "31", "20", "47",
      "52", "45", "4D", "4C", "49", "4E", "20", "47",
      "52", "41", "50", "48", "49", "43", "53", "20",
      "4C", "54", "44"
    ];
  }
}

const editorService = new EditorService();
