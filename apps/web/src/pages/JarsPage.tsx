import { useEffect, useState } from 'react';
import { useJars, type Jar, type CreateJarInput } from '../hooks/useJars';
import { JarForm } from '../components/JarForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

type FormMode = 'create' | 'edit' | null;

export function JarsPage() {
  const { jars, loading, error, fetchJars, createJar, updateJar, deleteJar } = useJars();
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [selectedJar, setSelectedJar] = useState<Jar | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchJars();
  }, [fetchJars]);

  const handleCreateSubmit = async (data: CreateJarInput) => {
    const result = await createJar(data);
    if (result) {
      setFormMode(null);
    }
  };

  const handleUpdateSubmit = async (data: CreateJarInput) => {
    if (selectedJar) {
      const result = await updateJar(selectedJar.id, data);
      if (result) {
        setFormMode(null);
        setSelectedJar(null);
      }
    }
  };

  const handleDelete = async (jarId: string) => {
    await deleteJar(jarId);
    setDeleteConfirm(null);
  };

  const startEdit = (jar: Jar) => {
    setSelectedJar(jar);
    setFormMode('edit');
  };

  const handleCancel = () => {
    setFormMode(null);
    setSelectedJar(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-text">Frascos</h2>
          <p className="mt-2 text-muted">Gestión de frascos con asignación clara y visual minimalista.</p>
        </div>
        {formMode === null && (
          <Button
            onClick={() => setFormMode('create')}
            variant="primary"
            size="lg"
          >
            + Nuevo Frasco
          </Button>
        )}
      </div>

      {error && <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-danger">{error}</div>}

      {formMode === 'create' && (
        <Card title="Crear frasco" className="bg-cardHigh">
          <JarForm
            onSubmit={handleCreateSubmit}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </Card>
      )}

      {formMode === 'edit' && selectedJar && (
        <Card title="Editar frasco" className="bg-cardHigh">
          <JarForm
            jar={selectedJar}
            onSubmit={handleUpdateSubmit}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </Card>
      )}

      {loading && formMode === null && (
        <div className="text-center py-12">
          <p className="text-muted">Cargando frascos...</p>
        </div>
      )}

      {!loading && jars.length === 0 && formMode === null && (
        <div className="rounded-xl border border-border/20 bg-card p-10 text-center">
          <p className="text-muted">No tienes frascos aún. Crea uno para comenzar.</p>
        </div>
      )}

      {jars.length > 0 && formMode === null && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jars.map((jar) => (
            <Card
              key={jar.id}
              className="bg-cardHigh"
            >
              <div className="mb-3 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: jar.color }}
                    />
                    <h3 className="text-lg font-semibold text-text">{jar.name}</h3>
                  </div>
                  {jar.description && <p className="text-sm text-muted mt-1">{jar.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startEdit(jar)}
                    variant="ghost"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm(jar.id)}
                    variant="danger"
                    size="sm"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>

              {deleteConfirm === jar.id && (
                <div className="mb-3 rounded-lg border border-danger/40 bg-danger/10 p-3">
                  <p className="mb-2 text-sm text-danger">¿Seguro que deseas eliminar este frasco?</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDelete(jar.id)}
                      variant="danger"
                      size="sm"
                    >
                      Sí, eliminar
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm(null)}
                      variant="ghost"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Porcentaje:</span>
                  <span className="font-semibold text-text">{jar.percentageOfIncome}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Moneda:</span>
                  <span className="font-semibold text-text">{jar.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Estado:</span>
                  {jar.active ? <Badge variant="success">Activo</Badge> : <Badge>Inactivo</Badge>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
