import React from "react";
import moment from "moment";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { openModal as deleteModal } from "../../features/TransactionModals/deleteModal";
import { openModal as viewAndUpdateModal } from "../../features/TransactionModals/viewAndUpdateModal";
import { EyeOutline as Eye, Edit, Delete } from "../../utils/Icons";

const TransactionTable = ({
  data,
  name,
  isLoading,
  setCurrentPage,
  totalPages,
  currentPage,
  chipColorMap,
  showMicroSavings = false,
}) => {
  const dispatch = useDispatch();

  const pagination = totalPages > 1 ? (
    <div className="flex w-full justify-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={currentPage}
        total={totalPages}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  ) : null;

  const classNames = {
    base: "pb-12",
    wrapper: "h-full px-8 box-shadow-second",
    table: !data ? "h-full" : "",
  };

  const loadingState = isLoading ? "loading" : "idle";
  const emptyContent = !data && !isLoading
    ? `No ${name}s to display. Please add some ${name}s!`
    : "";

  const actionButtons = ({ title, amount, category, description, date, _id }) => (
    <TableCell className="relative flex items-center gap-2">
      <Tooltip content="View More">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={() =>
            dispatch(viewAndUpdateModal({
              transaction: { title, amount, category, description, date },
              _id, type: name, isDisabled: true,
            }))
          }
        >
          <Eye />
        </span>
      </Tooltip>
      <Tooltip content="Edit">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={() =>
            dispatch(viewAndUpdateModal({
              transaction: { _id, title, amount, category, description, date },
              _id, type: name,
            }))
          }
        >
          <Edit />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={() => dispatch(deleteModal({ title, _id, type: name }))}
        >
          <Delete />
        </span>
      </Tooltip>
    </TableCell>
  );

  const descriptionCell = ({ title, amount, category, description, date, _id }) => (
    <TableCell
      className={`transition-all ${
        (description?.length ?? 0) > 20 ? "hover:text-gray-400 hover:cursor-pointer" : ""
      }`}
      onClick={() => {
        if ((description?.length ?? 0) > 20) {
          dispatch(viewAndUpdateModal({
            transaction: { title, amount, category, description, date },
            _id, type: name, isDisabled: true,
          }));
        }
      }}
    >
      {(description?.length ?? 0) > 20
        ? `${description.slice(0, 20)}...`
        : description}
    </TableCell>
  );

  if (showMicroSavings) {
    return (
      <div className="w-full h-full flex justify-center">
        <Table
          aria-label="Transactions table"
          bottomContent={pagination}
          classNames={classNames}
        >
          <TableHeader>
            <TableColumn className="capitalize">{name}</TableColumn>
            <TableColumn>Amount</TableColumn>
            <TableColumn>Round-off</TableColumn>
            <TableColumn>💜 Savings</TableColumn>
            <TableColumn>Category</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody
            loadingContent={<Spinner color="primary" size="lg" />}
            loadingState={loadingState}
            emptyContent={emptyContent}
          >
            {(data || []).map((item) => {
              const { title, amount, roundOff, savings, category, date, _id } = item;
              return (
                <TableRow key={_id}>
                  <TableCell className="text-primary font-calSans tracking-wider capitalize">{title}</TableCell>
                  <TableCell>₹{amount}</TableCell>
                  <TableCell className="text-blue-400 font-semibold">₹{roundOff ?? Math.ceil(amount / 10) * 10}</TableCell>
                  <TableCell className="text-purple-500 font-semibold">₹{savings ?? (Math.ceil(amount / 10) * 10) - amount}</TableCell>
                  <TableCell>
                    <Chip className="capitalize" color={chipColorMap[category]} size="sm" variant="flat">
                      {category}
                    </Chip>
                  </TableCell>
                  {descriptionCell(item)}
                  <TableCell>{moment(date).format("YYYY-MM-DD")}</TableCell>
                  {actionButtons(item)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center">
      <Table
        aria-label="Transactions table"
        bottomContent={pagination}
        classNames={classNames}
      >
        <TableHeader>
          <TableColumn className="capitalize">{name}</TableColumn>
          <TableColumn>Amount</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          loadingContent={<Spinner color="primary" size="lg" />}
          loadingState={loadingState}
          emptyContent={emptyContent}
        >
          {(data || []).map((item) => {
            const { title, amount, category, date, _id } = item;
            return (
              <TableRow key={_id}>
                <TableCell className="text-primary font-calSans tracking-wider capitalize">{title}</TableCell>
                <TableCell>₹{amount}</TableCell>
                <TableCell>
                  <Chip className="capitalize" color={chipColorMap[category]} size="sm" variant="flat">
                    {category}
                  </Chip>
                </TableCell>
                {descriptionCell(item)}
                <TableCell>{moment(date).format("YYYY-MM-DD")}</TableCell>
                {actionButtons(item)}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;