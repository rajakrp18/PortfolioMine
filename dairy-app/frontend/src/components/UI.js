// src/components/UI.js
// All shared atomic components — import from here everywhere

import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Card ─────────────────────────────────────────────────────
export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between p-5 border-b border-gray-100">
    <div>
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

// ── Stat Card ─────────────────────────────────────────────────
// icon: lucide component, value: number/string, label, change (optional)
export const StatCard = ({ icon: Icon, value, label, change, color = 'emerald', loading }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue:    'bg-blue-50   text-blue-700',
    orange:  'bg-orange-50 text-orange-700',
    purple:  'bg-purple-50 text-purple-700',
    red:     'bg-red-50    text-red-700',
    yellow:  'bg-yellow-50 text-yellow-700',
  };

  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                         flex-shrink-0 ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          {loading
            ? <div className="h-6 w-20 bg-gray-100 animate-pulse rounded" />
            : <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
          }
          <p className="text-xs text-gray-500 mt-1 truncate">{label}</p>
          {change !== undefined && (
            <p className={`text-xs font-medium mt-0.5
                           ${parseFloat(change) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {parseFloat(change) >= 0 ? '▲' : '▼'} {Math.abs(change)}%
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

// ── Badge ─────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100   text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  dispatched: 'bg-orange-100 text-orange-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-red-100    text-red-700',
  paid:       'bg-emerald-100 text-emerald-700',
  failed:     'bg-red-100    text-red-700',
  active:     'bg-emerald-100 text-emerald-700',
  inactive:   'bg-gray-100   text-gray-500',
  assigned:   'bg-blue-100   text-blue-700',
  in_transit: 'bg-orange-100 text-orange-700',
  default:    'bg-gray-100   text-gray-600',
};

export const Badge = ({ status, text, className = '' }) => {
  const key   = (status || text || '').toLowerCase().replace(' ', '_');
  const style = BADGE_VARIANTS[key] || BADGE_VARIANTS.default;
  const label = text || status || '';

  return (
    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5
                      rounded-full capitalize ${style} ${className}`}>
      {label.replace('_', ' ')}
    </span>
  );
};

// ── Button ────────────────────────────────────────────────────
export const Button = ({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', disabled, loading, className = '', icon: Icon
}) => {
  const variants = {
    primary:   'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm',
    danger:    'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100',
    outline:   'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost:     'hover:bg-gray-100 text-gray-600',
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-bold rounded-xl
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-95
                  ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────
export const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
    <input
      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none
                  transition-colors placeholder:text-gray-400
                  ${error
                    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                    : 'border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200'
                  }`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Select ────────────────────────────────────────────────────
export const Select = ({ label, error, children, className = '', ...props }) => (
  <div className={className}>
    {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
    <select
      className={`w-full border rounded-lg px-3 py-2 text-sm outline-none bg-white
                  ${error ? 'border-red-400' : 'border-gray-300 focus:border-emerald-500'}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Spinner ───────────────────────────────────────────────────
export const Spinner = ({ className = '' }) => (
  <div className={`flex items-center justify-center py-12 ${className}`}>
    <Loader2 size={28} className="animate-spin text-emerald-600" />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, width = 'max-w-lg' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
           onClick={onClose} />
      {/* Panel */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${width}
                       max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  );
};

// ── Table ─────────────────────────────────────────────────────
export const Table = ({ headers, children, empty = 'No data found' }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          {headers.map((h) => (
            <th key={h} className="text-left text-xs font-semibold text-gray-500
                                   uppercase tracking-wide px-4 py-3 whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {React.Children.count(children) === 0
          ? <tr><td colSpan={headers.length}
                    className="text-center py-10 text-gray-400 text-sm">{empty}</td></tr>
          : children
        }
      </tbody>
    </table>
  </div>
);

export const Tr = ({ children, onClick, className = '' }) => (
  <tr onClick={onClick}
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${onClick ? 'cursor-pointer' : ''} ${className}`}>
    {children}
  </tr>
);

export const Td = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>
);

// ── Page header ───────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ── Empty state ───────────────────────────────────────────────
export const Empty = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <Icon size={40} className="text-gray-300 mb-3" />}
    <p className="font-medium text-gray-500">{title}</p>
    {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
  </div>
);

// ── Currency formatter ─────────────────────────────────────────
export const currency = (val) =>
  `₹${parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
