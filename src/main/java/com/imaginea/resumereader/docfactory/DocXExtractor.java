package com.imaginea.resumereader.docfactory;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

public class DocXExtractor implements DocumentExtractor {
	private final Logger LOGGER = Logger.getLogger(this.getClass().getName());

	public String getTextContent(String filePath) throws IOException {
		XWPFDocument docx = null;
		try {
			docx = new XWPFDocument(new FileInputStream(filePath));
		} catch (FileNotFoundException fne) {
			LOGGER.log(Level.SEVERE, "File Not Found Exception occured",
					fne.getMessage());
			throw new FileNotFoundException();
		} catch (IOException ie) {
			LOGGER.log(Level.SEVERE, "IOException occured", ie.getMessage());
			throw new IOException(ie.getMessage(), ie);
		}
		XWPFWordExtractor we = new XWPFWordExtractor(docx);
		return we.getText();
	}

}
