"use client";

export const MessagesSideBar = () => {
  return (
    <div className="bg-primary w-72 h-screen absolute right-0 text-white">
      <div className="w-full border-2 flex gap-4 flex-col border-white p-4">
        <div className="flex gap-4 items-center">
          <img
            className="rounded-full h-12 w-12"
            src="https://s2-techtudo.glbimg.com/JsE244mucjKWLYtNgeiDyfVYlJQ=/0x129:1024x952/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/7/i/ME2AxRRoygUyFPCDe0jQ/3.png"
          />
          <span>Julio verne</span>
        </div>
        <div>
          <p>
            Última mensagem enviada por julio, Última mensagem enviada por
            julio...
          </p>
        </div>
      </div>
    </div>
  );
};
