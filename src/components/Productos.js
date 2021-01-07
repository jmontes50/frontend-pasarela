import React, { useState, useEffect } from "react";
import axios from "axios";
import { CulqiProvider, Culqi } from "react-culqi";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      let {
        data: { content },
      } = await axios.get("https://backend-pasarela.herokuapp.com/api/v1/productos");
      setProductos(content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerCargo = async (datos) => {
    let rpta = await axios.post("https://backend-pasarela.herokuapp.com/api/v1/comprar", {
      ...datos,
    });
    console.log({ rpta });
  };

  return (
    <div>
      {productos.map((prod, i) => (
        <div className="card" key={i}>
          <div className="card-body">
            <h4 className="card-title">{prod.nombre}</h4>
            <p className="card-text">{prod.descripcion}</p>
            <label>{prod.precio}</label>

            {/*  */}
            <CulqiProvider
              title={`Pagar ${prod.nombre}`}
              description="Proceder Compra"
              amount={`${prod.precio * 100}`}
              publicKey="pk_test_q7xrkzqnL6fqNGqI"
              onToken={(token) => {
                console.log("token recibido", token);
                let objDatos = {
                  amount: prod.precio * 100,
                  email: token.email,
                  source_id: token.id,
                };
                obtenerCargo(objDatos);
              }}
              onError={(error) => {
                console.log("Errorrr", error);
              }}
            >
              <div>
                <Culqi>
                  {({ openCulqi, setAmount, amount }) => {
                    return (
                      <div>
                        <h3>Monto a pagar: {amount}</h3>
                        <button className="btn btn-primary" onClick={openCulqi}>
                          Comprar
                        </button>
                      </div>
                    );
                  }}
                </Culqi>
              </div>
            </CulqiProvider>
          </div>
        </div>
      ))}
    </div>
  );
}
