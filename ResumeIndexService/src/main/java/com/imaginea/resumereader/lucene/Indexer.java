package com.imaginea.resumereader.lucene;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.FieldType;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.FieldInfo.IndexOptions;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;

public class Indexer {
	private final FSDirectory indexDir;
	private IndexWriter indexWriter;

	public Indexer(File indexDirFile) throws IOException {
		this.indexDir = FSDirectory.open(indexDirFile);
		this.indexWriter = new IndexWriter(indexDir, new IndexWriterConfig(
				Version.LUCENE_43, new StandardAnalyzer(Version.LUCENE_43)));
	}

	public void index(String content, String path, String title, String summary)
			throws IOException {
		indexWriter.updateDocument(new Term(IndexFieldNames.FILE_PATH_FIELD,
				path), convertToDoc(content, path, title, summary));
	}

	protected void commitAndCloseIndexer() throws IOException {
		indexWriter.commit();
		indexWriter.close();
	}

	private Document convertToDoc(String fileContent, String filePath,
			String title, String summary) {
		Document doc = new Document();
		FieldType type = new FieldType();
		type.setIndexed(true);
		type.setStored(true); // it needs to be stored to be properly
								// highlighted
		type.setTokenized(true);
		type.setIndexOptions(IndexOptions.DOCS_AND_FREQS_AND_POSITIONS_AND_OFFSETS); // necessary
																						// for
																						// PostingsHighlighter
		doc.add(new Field(IndexFieldNames.CONTENT_FIELD, fileContent, type));
		doc.add(new StringField(IndexFieldNames.FILE_PATH_FIELD, filePath,
				Field.Store.YES));
		doc.add(new Field(IndexFieldNames.TITLE_FIELD, title,
				StringField.TYPE_STORED));
		// doc.add(new StringField(IndexFieldNames.TITLE_FIELD, title,
		// Field.Store.YES));
		doc.add(new StringField(IndexFieldNames.SUMMARY_FIELD, summary,
				Field.Store.YES));
		return doc;
	}

}
