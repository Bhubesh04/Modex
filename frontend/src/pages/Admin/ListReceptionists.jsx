import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorBox from '../../components/ErrorBox';

const ListReceptionists = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceptionists = async () => {
      try {
        const response = await adminApi.getReceptionists();
        if (response.success) {
          setReceptionists(response.receptionists);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch receptionists');
      } finally {
        setLoading(false);
      }
    };

    fetchReceptionists();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">List of Receptionists</h1>
      {error && <ErrorBox message={error} onClose={() => setError('')} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {receptionists.map((receptionist) => (
          <Card key={receptionist._id}>
            <h3 className="text-xl font-semibold mb-2">{receptionist.name}</h3>
            <p className="text-gray-600 mb-1"><strong>Email:</strong> {receptionist.email}</p>
            <p className="text-gray-600 mb-1"><strong>Phone:</strong> {receptionist.phone || 'N/A'}</p>
            <p className="text-gray-600 mb-1">
              <strong>Status:</strong> 
              <span className={receptionist.isActive ? 'text-green-600' : 'text-red-600'}>
                {receptionist.isActive ? ' Active' : ' Inactive'}
              </span>
            </p>
          </Card>
        ))}
      </div>

      {receptionists.length === 0 && !loading && (
        <Card>
          <p className="text-center text-gray-600">No receptionists found</p>
        </Card>
      )}
    </div>
  );
};

export default ListReceptionists;



