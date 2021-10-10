class ROMService
{
	constructor()
	{
		this.generatedROM = null;
	}

	convertHexArrayToByteArray = (hexArray) =>
	{
		let byteArray = new Array();

		for(let i = 0; i < hexArray.length; i++)
			byteArray.push(parseInt(hexArray[i], 16));

		return byteArray;
  }

	getBytesAsDecimal = (bytes, byteFormat) =>
	{
		return byteFormat === "hex" ?
				this.convertHexArrayToByteArray(bytes) : bytes;
	}

	setByte = (filename, byteIndex, value) =>
	{
		let fileBytes = this.generatedROM[filename];

		if(fileBytes && !isNaN(value) && value > -1 && value < 256)
			fileBytes[byteIndex] = value;
	}

	setHexByte = (filename, byteIndex, value) =>
	{
		let fix = parseInt(value, 16);
		this.setByte(byteIndex, fix);
	}

	setBytes = (filename, byteIndex, bytes) =>
	{
		let fileBytes = this.generatedROM[filename];
		bytes.forEach((byte, index) => fileBytes[byteIndex + index] = byte);
	}

	getByte = (filename, byteIndex) =>
	{
		return this.generatedROM[filename][byteIndex];
	}

	getBytes = (filename, byteIndex, amount) =>
	{
		return this.generatedROM[filename].slice(
				byteIndex, byteIndex + amount);
	}

	indexOfBytes = (filename, bytes, byteFormat, startIndex) =>
	{
		let fileBytes = this.generatedROM[filename];

		if(fileBytes)
		{
			let fbs = this.getBytesAsDecimal(bytes, byteFormat);
			let checkBytes = (element, index, romBytes) =>
			{
				for(let i = 0; i < fbs.length; i++)
				{
					if(fbs[i] !== romBytes[index + i])
						return false;
				}
        
				return true;
			};
			return fileBytes.findIndex(checkBytes, startIndex);
		}

		return -1;
	}

	setROM = (rom, filename, checkBytes) =>
	{
		this.generatedROM = rom;

    if(rom[filename].length > 0)
    {
      if(this.indexOfBytes(filename, checkBytes, "hex", 0) > -1)
        return;
    }

    this.generatedROM = null;
    throw Error("Not a valid ROM!");
	}

  getROM = () =>
  {
    return this.generatedROM;
  }
}


let romService = new ROMService();