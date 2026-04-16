import type { DistributionMovement } from '../hooks/useIncomes';
import { Button } from './ui/Button';

interface DistributionPreviewProps {
  movements: DistributionMovement[];
  totalAmount: number;
  currency: string;
  onClose: () => void;
}

export function DistributionPreview({
  movements,
  totalAmount,
  currency,
  onClose,
}: DistributionPreviewProps) {
  const distributed = movements.reduce((sum, movement) => {
    return sum + Number(movement.amount);
  }, 0);
  const undistributed = totalAmount - distributed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl border border-border/20 bg-card shadow-float">
        <div className="sticky top-0 border-b border-border/20 bg-card px-6 py-4">
          <h3 className="m-0 text-xl font-semibold text-text">Distribución de ingreso</h3>
          <p className="mt-1 text-sm text-muted">
            Total distribuible: {Number(totalAmount).toFixed(2)} {currency}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {movements.map((movement, idx) => (
            <article key={`${movement.jarId}-${idx}`} className="rounded-lg border border-border/20 bg-cardHigh p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="m-0 font-semibold text-text">{movement.jarName}</h4>
                  <p className="mt-1 text-sm text-muted">{movement.percentage}% de distribución</p>
                </div>
                <div className="text-right">
                  <p className="m-0 text-lg font-semibold text-text">
                    {Number(movement.amount).toFixed(2)} {currency}
                  </p>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.min(100, Math.max(0, movement.percentage))}%` }}
                />
              </div>
            </article>
          ))}

          {undistributed > 0 && (
            <div className="rounded-lg border border-border/20 bg-bg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="m-0 font-semibold text-text">No distribuido</h4>
                  <p className="mt-1 text-sm text-muted">
                    Porcentajes no alcanzan el 100%
                  </p>
                </div>
                <div className="text-right">
                  <p className="m-0 text-lg font-semibold text-text">
                    {undistributed.toFixed(2)} {currency}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 flex justify-end border-t border-border/20 bg-card px-6 py-4">
          <Button onClick={onClose} variant="primary">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
