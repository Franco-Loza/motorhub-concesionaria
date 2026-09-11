'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';

export default function GestionEmpleadosPage() {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<any>(null);

  // Form State
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [dni, setDni] = useState('');
  const [rol, setRol] = useState('EMPLEADO');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activo, setActivo] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/empleados');
      if (res.ok) {
        const data = await res.json();
        setEmpleados(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCrear = () => {
    setEmpleadoEditando(null);
    setNombreCompleto('');
    setDni('');
    setRol('EMPLEADO');
    setEmail('');
    setTelefono('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setActivo(true);
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const abrirModalEditar = (emp: any) => {
    setEmpleadoEditando(emp);
    setNombreCompleto(emp.nombreCompleto);
    setDni(emp.dni || '');
    setRol(emp.rol);
    setEmail(emp.email || '');
    setTelefono(emp.telefono || '');
    setUsername(emp.username);
    setPassword('');
    setConfirmPassword('');
    setActivo(emp.activo);
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar coincidencia de contraseñas
    if (!empleadoEditando) {
      if (!password.trim()) {
        setError('Debe ingresar una contraseña');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas ingresadas no coinciden. Por favor, verifíquelas.');
        return;
      }
    } else {
      if (password.trim()) {
        if (password !== confirmPassword) {
          setError('Las contraseñas ingresadas no coinciden. Por favor, verifíquelas.');
          return;
        }
      }
    }

    setSaving(true);

    try {
      const url = empleadoEditando
        ? `/api/empleados/${empleadoEditando.id}`
        : '/api/empleados';
      const method = empleadoEditando ? 'PUT' : 'POST';

      const payload: any = {
        nombreCompleto,
        dni,
        rol,
        email,
        telefono,
        username,
        activo,
      };

      if (password.trim()) {
        payload.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('¡Empleado guardado con éxito!');
        cargarEmpleados();
        setTimeout(() => {
          setModalOpen(false);
        }, 1000);
      } else {
        setError(data.error || 'Error al guardar empleado');
      }
    } catch (err) {
      setError('Error de comunicación con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción es irreversible.')) {
      return;
    }

    try {
      const res = await fetch(`/api/empleados/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarEmpleados();
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo eliminar el empleado');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const q = filtro.toLowerCase();
    return (
      emp.nombreCompleto.toLowerCase().includes(q) ||
      emp.username.toLowerCase().includes(q) ||
      (emp.dni && emp.dni.includes(q))
    );
  });

  return (
    <>
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600 block mb-1">
              Gestión de Personal
            </span>
            <h1 className="text-3xl font-extrabold text-black font-['Outfit']">
              Gestión de Empleados
            </h1>
          </div>
          <button
            onClick={abrirModalCrear}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Registrar Empleado
          </button>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 flex items-center gap-3">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por nombre, usuario o DNI..."
            className="w-full text-xs bg-transparent focus:outline-none font-medium"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Empleado/Usuario</th>
                  <th className="py-3 px-4">DNI/Documento</th>
                  <th className="py-3 px-4">Rol en Sistema</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      Cargando nómina de empleados...
                    </td>
                  </tr>
                ) : empleadosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      No se encontraron empleados registrados.
                    </td>
                  </tr>
                ) : empleadosFiltrados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-black text-sm">{emp.nombreCompleto}</div>
                      <div className="text-[11px] text-zinc-400 font-normal">@{emp.username}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{emp.dni || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          emp.rol === 'DUENO'
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {emp.rol === 'DUENO' ? 'ADMINISTRADOR' : 'EMPLEADO'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{emp.email || '-'}</div>
                      <div className="text-[11px] text-zinc-400">{emp.telefono || ''}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {emp.activo ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          <UserCheck className="w-3 h-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded text-[10px] font-bold">
                          <UserX className="w-3 h-3" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => abrirModalEditar(emp)}
                          className="p-1.5 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 cursor-pointer transition-colors"
                          title="Editar empleado"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(emp.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Eliminar empleado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Crear / Editar Centrado y Responsivo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 space-y-6 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-xl font-bold text-black font-['Outfit']">
                {empleadoEditando ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-black cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(empleadoEditando)}
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Ej. Juan Manuel Pérez"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium disabled:opacity-60 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                    DNI
                  </label>
                  <input
                    type="text"
                    disabled={Boolean(empleadoEditando)}
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Documento"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium disabled:opacity-60 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                    Rol del Sistema
                  </label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-bold"
                  >
                    <option value="EMPLEADO">EMPLEADO</option>
                    <option value="DUENO">ADMINISTRADOR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+54 9..."
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                  Usuario de Acceso *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(empleadoEditando)}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="usuario123"
                  className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium disabled:opacity-60 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                    {empleadoEditando ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}
                  </label>
                  <input
                    type="password"
                    required={!empleadoEditando}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1">
                    {empleadoEditando ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
                  </label>
                  <input
                    type="password"
                    required={!empleadoEditando || Boolean(password.trim())}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 text-xs bg-zinc-50 border rounded-xl focus:outline-none font-medium transition-colors ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900'
                        : confirmPassword && password === confirmPassword
                        ? 'border-emerald-400 focus:border-emerald-500 bg-emerald-50/20 text-emerald-900'
                        : 'border-zinc-200 focus:border-black'
                    }`}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold">Las contraseñas no coinciden</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Las contraseñas coinciden</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <label htmlFor="activo" className="text-xs font-bold uppercase tracking-wide text-zinc-800 cursor-pointer">
                  Usuario Activo en el Sistema
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-600 bg-zinc-100 hover:bg-zinc-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar Empleado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
