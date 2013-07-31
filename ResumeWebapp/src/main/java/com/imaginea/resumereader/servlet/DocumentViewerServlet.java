package com.imaginea.resumereader.servlet;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.ToHTMLContentHandler;
import org.xml.sax.SAXException;

import com.imaginea.resumereader.exceptions.FileDirectoryEmptyException;
import com.imaginea.resumereader.helpers.FilePathHelper;

public class DocumentViewerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = Logger
			.getLogger(DocumentViewerServlet.class.getName());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		String filePath = req.getParameter("filename");
		String resumePath = "";
		try {
			resumePath = new FilePathHelper().getCanonicalPath(filePath);
			LOGGER.log(Level.INFO, "viewing document: " + filePath
					+ "\n ResumePath:" + resumePath);
		} catch (FileDirectoryEmptyException fe) {
			LOGGER.log(Level.SEVERE, fe.getMessage());
			res.sendError(HttpServletResponse.SC_SERVICE_UNAVAILABLE,
					fe.getMessage());
		}
		PrintWriter printWriter = res.getWriter();

		try {
			printWriter.println(getHtml(resumePath));
		} catch (IOException ioe) {
			LOGGER.log(Level.SEVERE, ioe.getMessage(), ioe);
			res.sendError(HttpServletResponse.SC_NOT_FOUND, ioe.getMessage());
		} catch (SAXException saex) {
			LOGGER.log(Level.SEVERE, saex.getMessage(), saex);
			res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					saex.getMessage());
		} catch (TikaException tkex) {
			LOGGER.log(Level.SEVERE, tkex.getMessage(), tkex);
			res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					tkex.getMessage());
		}
	}

	public String getHtml(String filePath) throws IOException, SAXException, TikaException {
		InputStream inputStream = null;
		String htmlContent = null;
		try {
			inputStream = new FileInputStream(filePath);
			ToHTMLContentHandler toHTMLHandler = new ToHTMLContentHandler();
			Metadata metadata = new Metadata();
			Parser parser = new AutoDetectParser();

			parser.parse(inputStream, toHTMLHandler, metadata,
					new ParseContext());
			htmlContent = toHTMLHandler.toString();
		} finally {
			inputStream.close();
		}
		return htmlContent;
	}
}
