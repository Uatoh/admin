import { useEffect, useState } from 'react';
import { userRequest } from '../../requestMethods';
import './widgetLg.css';
import { format } from 'timeago.js';

export default function WidgetLg() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get('orders');
        setOrders(res.data);
      } catch {}
    };
    const getUsers = async () => {
      try {
        const res = await userRequest.get('users');
        setUsers(res.data);
      } catch {}
    };
    getOrders();
    getUsers();
  }, []);

  const getUsernameByUserId = (userId) => {
    const foundUser = users.find((user) => user._id === userId);
    return foundUser ? foundUser.username : 'Unknown User';
  };

  const Button = ({ type }) => {
    return <button className={'widgetLgButton ' + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Customer</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        {orders.map((order) => (
          <tr className="widgetLgTr" key={order._id}>
            <td className="widgetLgUser">
              <span className="widgetLgName">
                {getUsernameByUserId(order.userId)}
              </span>
            </td>
            <td className="widgetLgDate">{format(order.createdAt)}</td>
            <td className="widgetLgAmount">Rp{order.amount}</td>
            <td className="widgetLgStatus">
              <Button type={order.status} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
