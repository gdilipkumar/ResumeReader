package com.imaginea.resumereader.servlet;

import java.io.IOException;
import java.text.ParseException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.imaginea.resumereader.base.ResumeIndexSearcher;
import com.imaginea.resumereader.exceptions.FileDirectoryEmptyException;
import com.imaginea.resumereader.helpers.PropertyFileReader;

public class IndexUpdateServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private final Logger LOGGER = Logger.getLogger(this.getClass());

	public void doPost(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		try {
			if (isAutorizedUser(req.getHeader("accessKey"))) {
				boolean cleanUpdate = Boolean.parseBoolean(req
						.getParameter("cleanUpdate"));
				ResumeIndexSearcher resumeIndexer = new ResumeIndexSearcher();

				int numOfUpdated = 0;

				if (cleanUpdate) {
					// performing clean & index
					numOfUpdated = resumeIndexer.CleanAndIndex();

				} else {
					// performing only updating index
					numOfUpdated = resumeIndexer.updateIndex();
				}

				res.getWriter().print(
						"Number of Files added to the index: " + numOfUpdated);
			} else {
				res.sendError(HttpServletResponse.SC_UNAUTHORIZED,
						"Security Key Not matched");
				LOGGER.warn("Security Key Not Matched");
			}
		} catch (IOException | FileDirectoryEmptyException | ParseException e) {
			LOGGER.error(e.getMessage());
			res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					e.getMessage());
			return;
		}

	}

	private boolean isAutorizedUser(String securityKey) throws IOException {
		PropertyFileReader prop = null;
		prop = PropertyFileReader.getInstance();
		if (securityKey.trim().equals(prop.getSecurityKey())) {
			return true;
		}
		return false;
	}
}
