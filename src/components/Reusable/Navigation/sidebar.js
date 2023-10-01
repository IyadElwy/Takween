import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Logo from "../logo";

export default function SideBar({ drawerState, setDrawerState }) {
  return (
    <div>
      <Drawer
        anchor="left"
        open={drawerState}
        onClose={() => setDrawerState(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerState(false)}
          onKeyDown={() => setDrawerState(false)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Logo
              spin
              height={50}
              width={50}
              style={{
                marginTop: "5px",
                marginBottom: "5px",
                marginRight: "10px",
              }}
            />
            <p className="font-bold text-inherit">Multi Modal Lab</p>
          </div>

          <Divider />

        </Box>
      </Drawer>
    </div>
  );
}
