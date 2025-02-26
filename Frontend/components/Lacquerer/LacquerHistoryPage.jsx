import React, { useState, useEffect } from 'react';

const LacquerHistory = ({ history }) => {
  return (
    <div className="lacquer-history">
      <h2>Historia zamówień lakierów</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Lakier</th>
            <th>Ilość</th>
            <th>Cena</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.lacquer}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LacquerHistory;
