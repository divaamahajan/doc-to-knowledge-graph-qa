
import React, { useState, useEffect } from "react";

function Filehandler({ user, token }) {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(-1);
  const API_BASE = process.env.REACT_APP_API_BASE || "";
  const FILE_HANDLER_BASE = `${API_BASE}/file_handler`;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FILE_HANDLER_BASE}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const downloadFile = (filename) => {
    window.open(
      `${FILE_HANDLER_BASE}/file-download/${filename}?token=${token}`,
      "_blank"
    );
  };

  const uploadFiles = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      setUploadingIndex(i);
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${FILE_HANDLER_BASE}/file-upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setUploadingIndex(-1);
    setSelectedFiles([]);
    await fetchFiles();
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;
    try {
      const res = await fetch(`${FILE_HANDLER_BASE}/files/${filename}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const getFileIcon = (contentType) => {
    if (contentType?.includes('image')) return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    if (contentType?.includes('pdf')) return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    if (contentType?.includes('text')) return 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z';
    if (contentType?.includes('video')) return 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
    if (contentType?.includes('audio')) return 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3';
    return 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Management</h1>
          <p className="text-gray-600">Upload, organize, and manage your documents and media files</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload Files</h2>
            <p className="text-sm text-gray-500">Select one or more files to upload to your storage</p>
          </div>
          
          <form onSubmit={uploadFiles} className="space-y-6">
            <div className="relative">
              <input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                accept="*/*"
              />
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-3">
                  Selected Files ({selectedFiles.length})
                </h3>
                <ul className="space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        uploadingIndex === idx 
                          ? "bg-blue-100 border border-blue-200" 
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        {uploadingIndex === idx && (
                          <div className="flex items-center text-blue-600 text-xs font-medium">
                            <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full mr-1"></div>
                            Uploading...
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
                uploadingIndex >= 0
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
              }`}
              disabled={selectedFiles.length === 0 || uploadingIndex >= 0}
            >
              {uploadingIndex >= 0 ? (
                <>
                  <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full mr-2"></div>
                  Uploading file {uploadingIndex + 1} of {selectedFiles.length}...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Files
                </>
              )}
            </button>
          </form>
        </div>

        {/* Files List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">File Library</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your uploaded files and documents</p>
              </div>
              {!loading && files.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-gray-600">Loading files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
                <p className="text-gray-500">Get started by uploading your first file</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {files.map((f, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-500">{i + 1}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getFileIcon(f.content_type)} />
                              </svg>
                              <span className="text-sm font-medium text-gray-900 truncate max-w-xs" title={f.filename}>
                                {f.filename}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {(f.length / 1024).toFixed(1)} KB
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {new Date(f.uploadDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {f.content_type?.split('/')[1] || 'unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => downloadFile(f.filename)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                title="Download file"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                              </button>
                              <button
                                onClick={() => deleteFile(f.filename)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                title="Delete file"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filehandler;
