
// import React, { useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getOrders,
//   getDeliveryBoys,
//   assignDeliveryBoyToOrder,
// } from "../https";
// import toast from "react-hot-toast";

// const DeliveryMetrics = () => {
//   const queryClient = useQueryClient();

//   // --- Fetch Orders ---
//   const {
//     data: ordersRes,
//     isLoading: ordersLoading,
//     isError: ordersError,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: getOrders,
//   });

//   // --- Fetch Delivery Boys ---
//   const {
//     data: boysRes,
//     isLoading: boysLoading,
//     isError: boysError,
//   } = useQuery({
//     queryKey: ["deliveryBoys"],
//     queryFn: getDeliveryBoys,
//   });

//   const isLoading = ordersLoading || boysLoading;
//   const isError = ordersError || boysError;

//   // --- Safely extract data (avoid undefined errors) ---
//   const orders = ordersRes?.data?.data ?? [];
//   const deliveryBoys = boysRes?.data?.data ?? [];

//   // --- Filter delivery-type orders ---
//   const deliveryOrders = useMemo(
//     () => orders.filter((o) => o.customerDetails?.orderType === "Delivery"),
//     [orders]
//   );

//   const completedOrders = useMemo(
//     () => deliveryOrders.filter((o) => o.orderStatus === "Completed"),
//     [deliveryOrders]
//   );

//   const activeOrders = useMemo(
//     () => deliveryOrders.filter((o) => o.orderStatus !== "Completed"),
//     [deliveryOrders]
//   );

//   const totalRevenue = useMemo(
//     () =>
//       completedOrders.reduce(
//         (sum, o) => sum + (o.bills?.totalWithTax || 0),
//         0
//       ),
//     [completedOrders]
//   );

//   // --- Active riders (currently delivering) ---
//   const activeDeliveryBoys = useMemo(() => {
//     const activeIds = new Set(
//       activeOrders
//         .map((o) => o.deliveryBoyId?._id)
//         .filter((id) => typeof id === "string")
//     );
//     return deliveryBoys.filter((boy) => activeIds.has(boy._id));
//   }, [activeOrders, deliveryBoys]);

//   // --- Rider performance (completed count) ---
//   const riderStats = useMemo(() => {
//     const stats = {};
//     for (const o of completedOrders) {
//       const id = o.deliveryBoyId?._id;
//       if (!id) continue;
//       if (!stats[id]) stats[id] = { name: o.deliveryBoyId.name, count: 0 };
//       stats[id].count += 1;
//     }
//     return Object.values(stats);
//   }, [completedOrders]);

//   // --- Mutation for assigning/changing rider ---
//   const mutation = useMutation({
//     mutationFn: ({ orderId, deliveryBoyId }) =>
//       assignDeliveryBoyToOrder(orderId, deliveryBoyId),
//     onSuccess: () => {
//       toast.success("Delivery boy updated successfully!");
//       queryClient.invalidateQueries(["orders"]);
//     },
//     onError: (err) => {
//       toast.error(
//         err.response?.data?.message || "Failed to update delivery boy"
//       );
//     },
//   });

//   const handleAssign = (orderId, deliveryBoyId) => {
//     if (!deliveryBoyId) return;
//     mutation.mutate({ orderId, deliveryBoyId });
//   };

//   // --- Loading & Error states ---
//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-[#f5f5f5]">
//         <p>Loading Delivery Metrics...</p>
//       </div>
//     );

//   if (isError)
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#1f1f1f] text-red-400">
//         <p>Failed to fetch data.</p>
//       </div>
//     );

//   return (
//     <div className="container mx-auto py-8 px-6 bg-[#1f1f1f] min-h-screen font-inter">
//       <h2 className="font-extrabold text-[#f5f5f5] text-3xl mb-1 tracking-tight">
//         Delivery Metrics
//       </h2>
//       <p className="text-sm text-[#ababab] mb-6">
//         Insights and analytics for delivery orders.
//       </p>

//       {/* === Metric Summary Cards === */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         <MetricCard
//           title="Active Delivery Boys"
//           value={activeDeliveryBoys.length}
//           color="#10B981"
//         />
//         <MetricCard
//           title="Total Completed Deliveries"
//           value={completedOrders.length}
//           color="#3B82F6"
//         />
//         <MetricCard
//           title="Active Delivery Orders"
//           value={activeOrders.length}
//           color="#F59E0B"
//         />
//         <MetricCard
//           title="Total Revenue"
//           value={`BHD ${totalRevenue.toFixed(2)}`}
//           color="#22C55E"
//         />
//       </div>

//       {/* === Active Deliveries Table === */}
//       <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-xl mb-8">
//         <h3 className="text-[#02ca3a] text-xl font-bold mb-3">
//           🚴 Active Deliveries
//         </h3>
//         {activeOrders.length > 0 ? (
//           <table className="w-full text-left text-[#f5f5f5] border-t border-[#333]">
//             <thead>
//               <tr className="text-[#ababab] border-b border-[#333]">
//                 <th className="py-2 px-3">Order ID</th>
//                 <th className="py-2 px-3">Customer</th>
//                 <th className="py-2 px-3">Current Rider</th>
//                 <th className="py-2 px-3">Change Rider</th>
//                 <th className="py-2 px-3">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {activeOrders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="border-b border-[#333] hover:bg-[#333333] transition"
//                 >
//                   <td className="py-2 px-3">
//                     {order.orderId || order._id.slice(-6)}
//                   </td>
//                   <td className="py-2 px-3">
//                     {order.customerDetails?.name || "Unknown"}
//                   </td>
//                   <td className="py-2 px-3">
//                     {order.deliveryBoyId?.name || "Unassigned"}
//                   </td>
//                   <td className="py-2 px-3">
//                     <select
//                       value={order.deliveryBoyId?._id || ""}
//                       onChange={(e) =>
//                         handleAssign(order._id, e.target.value)
//                       }
//                       className="bg-[#1f1f1f] text-[#f5f5f5] border border-[#333] rounded-lg p-1 text-sm focus:outline-none"
//                     >
//                       <option value="">Select Rider</option>
//                       {deliveryBoys.map((boy) => (
//                         <option key={boy._id} value={boy._id}>
//                           {boy.name}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="py-2 px-3">{order.orderStatus}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-[#ababab]">No active deliveries currently.</p>
//         )}
//       </div>

//       {/* === Completed Deliveries by Rider === */}
//       <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-xl">
//         <h3 className="text-[#02ca3a] text-xl font-bold mb-3">
//           🏁 Rider Performance
//         </h3>
//         {riderStats.length > 0 ? (
//           <table className="w-full text-left text-[#f5f5f5] border-t border-[#333]">
//             <thead>
//               <tr className="text-[#ababab] border-b border-[#333]">
//                 <th className="py-2 px-3">Rider</th>
//                 <th className="py-2 px-3">Completed Orders</th>
//               </tr>
//             </thead>
//             <tbody>
//               {riderStats.map((rider, i) => (
//                 <tr
//                   key={i}
//                   className="border-b border-[#333] hover:bg-[#333333] transition"
//                 >
//                   <td className="py-2 px-3">{rider.name}</td>
//                   <td className="py-2 px-3">{rider.count}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-[#ababab]">No completed deliveries yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- MetricCard Component ---
// const MetricCard = ({ title, value, color }) => (
//   <div
//     className="bg-[#2a2a2a] p-6 rounded-2xl shadow-xl border-t-4 border-transparent hover:scale-[1.02] transition"
//     style={{ borderTopColor: color }}
//   >
//     <p className="font-semibold text-sm text-[#ababab]">{title}</p>
//     <p className="mt-2 font-extrabold text-3xl" style={{ color }}>
//       {value}
//     </p>
//   </div>
// );

// export default DeliveryMetrics;


import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  getDeliveryBoys,
  assignDeliveryBoyToOrder,
} from "../https";
import toast from "react-hot-toast";

const DeliveryMetrics = () => {
  const queryClient = useQueryClient();

  // === FETCH ORDERS ===
  const {
    data: ordersRes,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // === FETCH DELIVERY BOYS ===
  const {
    data: boysRes,
    isLoading: boysLoading,
    isError: boysError,
  } = useQuery({
    queryKey: ["deliveryBoys"],
    queryFn: getDeliveryBoys,
  });

  const isLoading = ordersLoading || boysLoading;
  const isError = ordersError || boysError;

  const orders = ordersRes?.data?.data ?? [];
  const deliveryBoys = boysRes?.data?.data ?? [];

  // === FILTER DELIVERY ORDERS ===
  const deliveryOrders = useMemo(
    () => orders.filter((o) => o.customerDetails?.orderType === "Delivery"),
    [orders]
  );

  const completedOrders = useMemo(
    () => deliveryOrders.filter((o) => o.orderStatus === "Completed"),
    [deliveryOrders]
  );

  const activeOrders = useMemo(
    () => deliveryOrders.filter((o) => o.orderStatus !== "Completed"),
    [deliveryOrders]
  );

  const totalRevenue = useMemo(
    () =>
      completedOrders.reduce(
        (sum, o) => sum + (o.bills?.totalWithTax || 0),
        0
      ),
    [completedOrders]
  );

  // === ACTIVE DELIVERY BOYS ===
  const activeDeliveryBoys = useMemo(() => {
    const activeIds = new Set(
      activeOrders
        .map((o) => o.deliveryBoyId?._id)
        .filter((id) => typeof id === "string")
    );
    return deliveryBoys.filter((boy) => activeIds.has(boy._id));
  }, [activeOrders, deliveryBoys]);

  // === RIDER PERFORMANCE ===
  const riderStats = useMemo(() => {
    const stats = {};
    for (const o of completedOrders) {
      const id = o.deliveryBoyId?._id;
      if (!id) continue;
      if (!stats[id]) stats[id] = { name: o.deliveryBoyId.name, count: 0 };
      stats[id].count += 1;
    }
    return Object.values(stats);
  }, [completedOrders]);

  // === MUTATION: ASSIGN RIDER ===
  const mutation = useMutation({
    mutationFn: ({ orderId, deliveryBoyId }) =>
      assignDeliveryBoyToOrder(orderId, deliveryBoyId),
    onSuccess: () => {
      toast.success("Delivery boy updated successfully!");
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update delivery boy"
      );
    },
  });

  const handleAssign = (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) return;
    mutation.mutate({ orderId, deliveryBoyId });
  };

  // === LOADING STATES ===
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0e0e0e] text-gray-200">
        <p>Loading Delivery Metrics...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0e0e0e] text-red-400">
        <p>Failed to fetch data.</p>
      </div>
    );

//   

return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 font-inter pb-24 md:pb-28">
      <header className="mb-6 sm:mb-8 lg:mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
          Delivery Metrics Dashboard
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Real-time insights and analytics for all delivery operations.
        </p>
      </header>

      {/* === METRIC CARDS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
        <MetricCard
          title="Active Delivery Boys"
          value={activeDeliveryBoys.length}
          color="#10B981"
        />
        <MetricCard
          title="Completed Deliveries"
          value={completedOrders.length}
          color="#3B82F6"
        />
        <MetricCard
          title="Active Orders"
          value={activeOrders.length}
          color="#F59E0B"
        />
        <MetricCard
          title="Revenue Generated"
          value={`BHD ${totalRevenue.toFixed(3)}`}
          color="#22C55E"
        />
      </div>

      {/* === ACTIVE ORDERS === */}
      <SectionCard title="🚴 Active Deliveries">
        {activeOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table
              headers={[
                "Order ID",
                "Customer",
                "Current Rider",
                "Change Rider",
                "Status",
              ]}
            >
              {activeOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-700 hover:bg-[#1f1f1f]/70 transition-colors"
                >
                  <td className="py-3 px-2 sm:px-4 font-medium text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                    {order.orderId || order._id.slice(-6)}
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">
                    <div className="max-w-[100px] sm:max-w-none truncate">
                      {order.customerDetails?.name}
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">
                    <div className="max-w-[100px] sm:max-w-none truncate">
                      {order.deliveryBoyId?.name || "Unassigned"}
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:px-4">
                    <select
                      value={order.deliveryBoyId?._id || ""}
                      onChange={(e) =>
                        handleAssign(order._id, e.target.value)
                      }
                      className="bg-[#111] border border-gray-600 rounded-lg p-1 sm:p-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none text-gray-200 w-full min-w-[100px] sm:min-w-[120px]"
                    >
                      <option value="">Select Rider</option>
                      {deliveryBoys.map((boy) => (
                        <option key={boy._id} value={boy._id}>
                          {boy.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                    <span className="hidden sm:inline">{order.orderStatus}</span>
                    <span className="sm:hidden">
                      {order.orderStatus === "In Progress" ? "Progress" : order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No active deliveries currently.</p>
        )}
      </SectionCard>

      {/* === RIDER PERFORMANCE === */}
      <SectionCard title="🏁 Rider Performance">
        {riderStats.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table headers={["Rider Name", "Completed Orders"]}>
              {riderStats.map((rider, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700 hover:bg-[#1f1f1f]/70 transition"
                >
                  <td className="py-3 px-2 sm:px-4 font-medium text-sm sm:text-base">{rider.name}</td>
                  <td className="py-3 px-2 sm:px-4 text-sm sm:text-base">{rider.count}</td>
                </tr>
              ))}
            </Table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base">No completed deliveries yet.</p>
        )}
      </SectionCard>
    </div>
  );
};

// === METRIC CARD === (Responsive)
const MetricCard = ({ title, value, color }) => (
  <div
    className="p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-lg bg-[#1a1a1a]/70 border border-gray-700 hover:shadow-[#3b82f650] transition transform hover:-translate-y-1"
    style={{ borderTop: `3px solid ${color}`, borderTopWidth: window.innerWidth >= 640 ? '4px' : '3px' }}
  >
    <p className="text-xs sm:text-sm text-gray-400 mb-1">{title}</p>
    <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold" style={{ color }}>
      {value}
    </p>
  </div>
);

// === SECTION WRAPPER === (Responsive)
const SectionCard = ({ title, children }) => (
  <div className="bg-[#141414]/90 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl mb-6 sm:mb-8 lg:mb-10 border border-gray-800 backdrop-blur-md">
    <h3 className="text-[#02ca3a] text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{title}</h3>
    {children}
  </div>
);

// === TABLE COMPONENT === (Responsive)
const Table = ({ headers, children }) => (
  <div className="min-w-full">
    <table className="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr className="border-b border-gray-700 bg-[#111]/70">
          {headers.map((h, i) => (
            <th
              key={i}
              className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">{children}</tbody>
    </table>
  </div>
);

export default DeliveryMetrics;
