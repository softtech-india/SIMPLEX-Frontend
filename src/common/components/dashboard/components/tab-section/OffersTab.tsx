import React from "react";

export default function OffersTab() {
  return (
    <>
      <div className="p-1 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Offers
          </h3>
          <p className="text-gray-600">
            This section is reserved for Offers content. You can list current offers,
            promotions, banners, or cards here.
          </p>

          {/* Example Offers list */}
          <div className="mt-4 space-y-3">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="text-md font-medium text-blue-700">
                🔥 Seasonal Discount
              </h4>
              <p className="text-sm text-gray-600">
                Offer details and conditions go here.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="text-md font-medium text-blue-700">
                💼 New Partner Incentive
              </h4>
              <p className="text-sm text-gray-600">
                Partner offer details here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
