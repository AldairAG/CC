const ApuestaDetailsPage = () => {
  return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Detalles de la Apuesta</h1>
        <p className="text-gray-700">Aquí van los detalles de la apuesta seleccionada.</p>
        {/* Aquí puedes agregar más detalles de la apuesta, como el monto apostado, el evento, etc. */}
        <div className="mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Volver a Apuestas
            </button>
        </div>
    </div>
  );
}
export default ApuestaDetailsPage;