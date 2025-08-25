import React, { useState, useEffect } from "react";

function URLHandler() {
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [urlInfo, setUrlInfo] = useState(null);
  const API_BASE = process.env.REACT_APP_API_BASE || "";
  const KNOWLEDGE_GRAPH_BASE = `${API_BASE}/knowledge-graph`;

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${KNOWLEDGE_GRAPH_BASE}/url-list`);
      if (!res.ok) throw new Error("Failed to fetch URLs");
      const data = await res.json();
      setUrls(data.urls || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const uploadUrl = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setUploading(true);
    try {
      const res = await fetch(`${KNOWLEDGE_GRAPH_BASE}/url-upload?url=${encodeURIComponent(urlInput)}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: ''
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Upload failed");
      }
      
      const result = await res.json();
      console.log("Upload result:", result);
      setUrlInput("");
      await fetchUrls();
    } catch (err) {
      console.error(err);
      alert(`Failed to upload URL: ${err.message}`);
    }
    setUploading(false);
  };

  const deleteUrl = async (url) => {
    if (!window.confirm(`Delete URL: ${url}?`)) return;
    
    try {
      const res = await fetch(`${KNOWLEDGE_GRAPH_BASE}/url-delete?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Delete failed");
      }
      
      await fetchUrls();
    } catch (err) {
      console.error(err);
      alert(`Failed to delete URL: ${err.message}`);
    }
  };

  const viewUrlInfo = async (url) => {
    try {
      const res = await fetch(`${KNOWLEDGE_GRAPH_BASE}/url-info?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to get URL info");
      }
      const data = await res.json();
      setUrlInfo(data);
      setSelectedUrl(url);
    } catch (err) {
      console.error(err);
      alert(`Failed to get URL info: ${err.message}`);
    }
  };

  const getDomainIcon = (domain) => {
    if (domain?.includes('wikipedia')) return 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z';
    if (domain?.includes('github')) return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    if (domain?.includes('docs.google') || domain?.includes('drive.google')) return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    if (domain?.includes('youtube') || domain?.includes('vimeo')) return 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
    return 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14';
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return 'Unknown';
    
    try {
      // Handle the nested date object structure from Neo4j
      let date;
      if (dateObj._DateTime__date) {
        const dateData = dateObj._DateTime__date;
        const timeData = dateObj._DateTime__time;
        date = new Date(dateData._Date__year, dateData._Date__month - 1, dateData._Date__day, 
                       timeData._Time__hour, timeData._Time__minute, timeData._Time__second);
      } else {
        date = new Date(dateObj);
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Management</h1>
          <p className="text-gray-600">Process web pages and URLs for your knowledge graph</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Add URL</h2>
            <p className="text-sm text-gray-500">Enter a URL to extract content and add it to your knowledge graph</p>
          </div>

          <form onSubmit={uploadUrl} className="space-y-6">
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full p-4 pr-16 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center ${
                uploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md"
              }`}
              disabled={!urlInput.trim() || uploading}
            >
              {uploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border border-white border-t-transparent rounded-full mr-2"></div>
                  Processing URL...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add URL to Knowledge Graph
                </>
              )}
            </button>
          </form>
        </div>

        {/* URLs List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">URL Library</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your processed URLs and web content</p>
              </div>
              {!loading && urls.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {urls.length} URL{urls.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-gray-600">Loading URLs...</p>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs processed</h3>
                <p className="text-gray-500">Get started by adding your first URL</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chunks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {urls.map((urlData, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm text-gray-500">{i + 1}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getDomainIcon(urlData.domain)} />
                              </svg>
                              <div className="min-w-0 flex-1">
                                <a 
                                  href={urlData.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block max-w-md"
                                  title={urlData.url}
                                >
                                  {urlData.url}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {urlData.domain}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {urlData.chunks} chunks
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {formatDate(urlData.uploaded_date)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewUrlInfo(urlData.url)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                title="View details"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Info
                              </button>
                              <button
                                onClick={() => deleteUrl(urlData.url)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                title="Delete URL"
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

        {/* URL Info Modal */}
        {urlInfo && selectedUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">URL Details</h3>
                  <button
                    onClick={() => {setUrlInfo(null); setSelectedUrl(null);}}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">URL</h4>
                  <a href={selectedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">
                    {selectedUrl}
                  </a>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Processing Stats</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Chunks:</span>
                        <span className="text-sm font-medium">{urlInfo.chunks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pages Processed:</span>
                        <span className="text-sm font-medium">{urlInfo.processing_stats?.pages_processed || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Extraction Errors:</span>
                        <span className="text-sm font-medium">{urlInfo.processing_stats?.extraction_errors || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Processing Date</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <span className="text-sm">{formatDate(urlInfo.processed_date)}</span>
                    </div>
                  </div>
                </div>

                {urlInfo.sample_chunks && urlInfo.sample_chunks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Sample Content</h4>
                    <div className="space-y-3">
                      {urlInfo.sample_chunks.map((chunk, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500">Chunk {chunk.index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{chunk.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default URLHandler;
