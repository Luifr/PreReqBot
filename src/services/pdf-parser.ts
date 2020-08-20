import pdf from 'pdf-parse';


const render_page = async (pageData: any) => {
	// Check documents https://mozilla.github.io/pdf.js/
	let render_options = {
		// Replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: true,
		// Do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false
	}

	const textContent = await pageData.getTextContent(render_options);
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
}

let options = {
	pagerender: render_page as any
}

let subjects: string[];

const processSubject = (line?: string) => {
	// If the process ends with A (meaning aprovado) add it to the subjects array
	if (!line || !line.endsWith(' A')) {
		return;
	}
	const subject = line.substr(0, line.indexOf(' '));
	subjects.push(subject.toLowerCase());
}

export const getSubjectsFromPdf = async (fileBuffer: Buffer): Promise<string[]> => {
	subjects = [];

	const pdfData = await pdf(fileBuffer, options);
	const pdfText = pdfData.text as string;
	// fs.writeFileSync("__pdf", pdfText);
	const lines = pdfText.split('\n');
	parsePdfSubjects(lines);

	return subjects;
}

const parsePdfSubjects = (lines: string[]) => {
	for (let index = 0; index < lines.length; index++) {
		// While it is not a semester begin line, skip to the next line
		if (!lines[index].endsWith('Semestre')) continue;
		index++;
		// While the current line is does not start with _______
		// The semester is not over, so keep precessing subjects
		while (!lines[index].startsWith('________')) {
			let lineToProcess = '';
			// Hole subject sline
			if (lines[index].match(/^\w{7} /)) {
				lineToProcess = lines[index];
			}
			// Broken subject line
			else if (lines[index].match(/^\w{7}$/)) {
				lineToProcess = lines[index] + " ";
				index++;
				// Loop until the end of multi-subject line
				while (!lines[index].match(/.{1,4} \d{1,3} \d{1,3} \d{1,2}\.?\d \w{1,2}$/)) {
					lineToProcess += lines[index] + " ";
					index++;
				}
				lineToProcess += lines[index];
			}
			processSubject(lineToProcess);
			index++;
		}
	}
}
