import PropertySearchForm from "@/components/PropertySearchForm";
import Properties from "@/components/Properties";

const PropertiesPage = async () => {
  return (
    <>
      <section className="bg-hero-background bg-cover bg-no-repeat bg-center py-4 mb-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <PropertySearchForm />
        </div>
      </section>
      <Properties />
    </>
  );
};

export default PropertiesPage;
