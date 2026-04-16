import type { DistributionMovement } from '../hooks/useIncomes';
import { getColorTailwind } from '../constants/jar-colors';

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
  const distributed = movements.reduce((sum, m) => sum + parseFloat(m.amount as any), 0);
  const undistributed = totalAmount - distributed;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900">Distribución de Ingreso</h3>
          <p className="text-sm text-gray-600 mt-1">
            Total: {totalAmount.toFixed(2)} {currency}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {movements.map((movement, idx) => (
            <div
              key={idx}
              className={`${getColorTailwind(movement.jarName as any)} bg-opacity-10 border-2 ${getColorTailwind(movement.jarName as any)} border-opacity-30 rounded-lg p-4`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{movement.jarName}</h4>
                  <p className="text-sm text-gray-600">{movement.percentage}% de distribución</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {parseFloat(movement.amount as any).toFixed(2)} {currency}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {undistributed > 0 && (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-700">No Distribuido</h4>
                  <p className="text-sm text-gray-600">
                    Porcentajes no alcanzan el 100%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-700">
                    {undistributed.toFixed(2)} {currency}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
