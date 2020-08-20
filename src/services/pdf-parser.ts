import pdf from 'pdf-parse';
import fs from 'fs';


const render_page = (pageData: any) => {
	//check documents https://mozilla.github.io/pdf.js/
	let render_options = {
		//replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: true,
		//do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false
	}

	return pageData.getTextContent(render_options)
		.then((textContent: any) => {
			let last, text = '';
			for (let item of textContent.items) {
				if (!last || last.transform[5] == item.transform[5]) {
					if (!last || last.transform[4] + last.width - item.transform[4] > -9) {
						text += item.str;
					}
					else {
						text += " " + item.str;
					}
				}
				else {
					text += '\n' + item.str;
				}
				last = item;
			}
			return text;
		});
}

let options = {
	pagerender: render_page
}

export const parsePdf = (subjectsPdfName: string): Promise<string[]> => {
	let dataBuffer = fs.readFileSync(subjectsPdfName);
	const subjects: string[] = [];

	const processSubject = (line?: string) => {
		if (!line || !line.endsWith(' A')) {
			return;
		}
		const subject = line.substr(0, line.indexOf(' '));
		subjects.push(subject.toLowerCase());
	}

	return pdf(dataBuffer, options).then((data: any) => {
		// PDF text
		const pdfText = data.text as string;
		// fs.writeFileSync("__pdf", pdfText);
		const lines = pdfText.split('\n');

		for (let index = 0; index < lines.length; index++) {
			let line = lines[index];
			if (!line.endsWith('Semestre')) continue;
			line = lines[++index];
			while (!line.startsWith('________')) {
				let lineToProcess: string;
				if (line.match(/^\w{7} /)) {
					lineToProcess = line;
				}
				else if (line.match(/^\w{7}$/)) {
					lineToProcess = line + " ";
					line = lines[++index];
					while(!line.match(/.{1,4} \d{1,3} \d{1,3} \d{1,2}\.?\d \w{1,2}$/)) {
						lineToProcess += line + " ";
						line = lines[++index];
					}
					lineToProcess += line;
				}
				processSubject(lineToProcess!);
				line = lines[++index];
			}
		}

		return subjects;
	});
}
