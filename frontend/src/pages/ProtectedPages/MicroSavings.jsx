import React from "react";
import { NumericFormat } from "react-number-format";
import { Spinner, Chip } from "@nextui-org/react";
import moment from "moment";
import { useGetAllExpensesUnpaginatedQuery } from "../../features/api/apiSlices/expenseApiSlice";

const MicroSavings = () => {
  const { data, isLoading } = useGetAllExpensesUnpaginatedQuery();

  const totalSavings = data?.totalSavings || 0;
  const expenses = data?.expenses || [];

  const savingsContributions = expenses.filter((e) => (e.savings || 0) > 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full mt-20">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-8 flex flex-col items-center gap-8">

      {/* Piggy Bank Card */}
      <div className="w-full max-w-md bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl shadow-lg p-8 flex flex-col items-center gap-3 text-white">
        <div className="text-6xl">🐷</div>
        <p className="text-lg font-medium opacity-80">Total Micro Savings</p>
        <h2 className="text-5xl font-bold">
          ₹
          <NumericFormat
            value={totalSavings}
            displayType="text"
            thousandSeparator={true}
          />
        </h2>
        <p className="text-sm opacity-70 text-center mt-1">
          Every rupee rounded up — saved automatically 💜
        </p>
      </div>

      {/* Contributions List */}
      <div className="w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4 text-center">
          💜 Round-off Contributions
        </h3>

        {savingsContributions.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">
            No savings yet! Add some expenses to start saving 🐷
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {savingsContributions.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 shadow-sm border border-purple-100 dark:border-zinc-700"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold capitalize text-primary">
                    {expense.title}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Chip size="sm" variant="flat" className="capitalize">
                      {expense.category}
                    </Chip>
                    <span>{moment(expense.date).format("YYYY-MM-DD")}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-sm">
                  <span className="text-gray-500">
                    ₹{expense.amount}{" "}
                    <span className="text-gray-400">→</span>{" "}
                    <span className="text-blue-400 font-semibold">
                      ₹{expense.roundOff}
                    </span>
                  </span>
                  <span className="text-purple-500 font-bold text-base">
                    +₹{expense.savings} saved
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroSavings;