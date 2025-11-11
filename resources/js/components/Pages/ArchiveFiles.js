// resources/js/components/Pages/ArchiveFiles.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import toastConfirm from '../../utils/toastConfirm';

export default function ArchiveFiles() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchives();
  }, []);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const typeFilter = query.get('type') || '';

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchArchives = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      if (typeFilter) params.type = typeFilter;
      const res = await axios.get('/api/archives', { params });

      // Expecting a paginated response: { data: [...], meta: { last_page, current_page } }
      const payload = res?.data?.data ?? res?.data ?? [];
      setArchives(Array.isArray(payload) ? payload : []);
      setCurrentPage(res?.data?.meta?.current_page || page);
      setLastPage(res?.data?.meta?.last_page || 1);
    } catch (error) {
      console.error('Error fetching archives:', error);
      toast.error('Unable to load archives');
      setArchives([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item) => {
    const ok = await toastConfirm(`Restore archived item ${item.title || item.name || item.id}?`, { okText: 'Restore', cancelText: 'Cancel' });
    if (!ok) return;

    try {
      // ArchiveController exposes POST /api/archives/{id}/restore
      const res = await axios.post(`/api/archives/${item.id}/restore`);
      if (res.status === 200) {
        toast.success(res.data?.message || 'Restored');
      } else {
        toast.success('Restored');
      }
      // refresh
      fetchArchives(currentPage);
    } catch (error) {
      console.error('Error restoring archive:', error);
      toast.error(error.response?.data?.message || 'Restore failed');
    }
  };

  const handleDownload = (item) => {
    // Always request the server-generated PDF for consistent output (Personal + Academic info)
    const doDownloadBlob = (blobData, filename) => {
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'archive.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    };

    (async () => {
      try {
        // prefer server endpoint which generates a standardized PDF
        const res = await axios.get(`/api/archives/${item.id}/download`, { responseType: 'blob' });
        const cd = res.headers['content-disposition'] || '';
        let filename = item.title || `archive-${item.id}.pdf`;
        const m = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(cd);
        if (m && m[1]) filename = m[1].replace(/['\"]/g, '');
        // ensure .pdf extension
        if (!/\.pdf$/i.test(filename)) filename = filename + '.pdf';
        doDownloadBlob(res.data, filename);
      } catch (error) {
        console.error('Archive download error', error);
        // If server returns JSON with a message, show it
        const msg = error?.response?.data?.message || error.message || 'Unable to download archive';
        toast.error(msg);
      }
    })();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0 text-gray-800">Archived Files & Records</h1>
              <p className="mb-0 text-muted">Manage archived student and faculty files.</p>
            </div>
          </div>

          <div className="card shadow">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">Loading archives...</div>
              ) : archives.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-archive fa-3x mb-3"></i>
                  <div>No archived items found</div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {archives.map(a => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td>{a.resource_type || a.type || 'N/A'}</td>
                          <td>{a.title || a.name || (a.data?.name) || 'Untitled'}</td>
                          <td>{a.created_at ? new Date(a.created_at).toLocaleString() : ''}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleDownload(a)}>
                                <i className="fas fa-download"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-success" onClick={() => handleRestore(a)}>
                                <i className="fas fa-undo"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
