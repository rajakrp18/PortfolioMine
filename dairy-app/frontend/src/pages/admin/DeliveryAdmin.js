// src/pages/admin/DeliveryAdmin.js — TODO: full implementation follows same pattern
// as CollectionEntry.js and OrdersAdmin.js — uses api, Table, Modal, etc.
import React from 'react';
import { PageHeader } from '../../components/UI';
const DeliveryAdmin = () => (
  <div>
    <PageHeader title="DeliveryAdmin" subtitle="Admin panel — coming soon" />
    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
      <p className="text-4xl mb-4">🚧</p>
      <p className="font-semibold">This module follows the same pattern as CollectionEntry and OrdersAdmin.</p>
      <p className="text-sm mt-2">Use api.get/post/put with the route endpoints documented in the backend.</p>
    </div>
  </div>
);
export default DeliveryAdmin;
