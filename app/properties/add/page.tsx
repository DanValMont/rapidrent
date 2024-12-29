import PropertyAddForm from "@/components/PropertyAddForm";
const PropertyAddPage = () => {
  return (
    <section className="bg-blue-50 dark:bg-[#161c20]">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white dark:bg-[#161c20] px-6 py-8 mb-4 dark:shadow-[rgba(62,62,62,0.3)] shadow-md rounded-md border m-4 md:m-0">
          <PropertyAddForm />
        </div>
      </div>
    </section>
  );
};

export default PropertyAddPage;
